-- Trinity Academy: run in a new Supabase project using the SQL editor.
-- Create users in Supabase Auth first, then provision each user's profile below.
-- Never use the service-role key in the browser.

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

CREATE TABLE public.teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    phone TEXT,
    bio TEXT,
    color TEXT DEFAULT 'indigo',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.teacher_payment_details (
    teacher_id TEXT PRIMARY KEY REFERENCES public.teachers(id) ON DELETE CASCADE,
    bank_account TEXT NOT NULL
);

CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES public.teachers(id),
    name TEXT NOT NULL,
    phone TEXT,
    school TEXT,
    parent_phone TEXT,
    checkin_code TEXT UNIQUE,
    session_price INTEGER NOT NULL DEFAULT 45000,
    teacher_share INTEGER NOT NULL DEFAULT 22500,
    director_share INTEGER NOT NULL DEFAULT 22500,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    registered_at TEXT,
    notes TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.attendances (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id),
    teacher_id TEXT NOT NULL REFERENCES public.teachers(id),
    student_name_snapshot TEXT,
    teacher_name_snapshot TEXT,
    session_price_snapshot INTEGER NOT NULL DEFAULT 45000,
    teacher_share_snapshot INTEGER NOT NULL DEFAULT 22500,
    director_share_snapshot INTEGER NOT NULL DEFAULT 22500,
    date TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL,
    excuse_reason TEXT,
    is_counted BOOLEAN NOT NULL DEFAULT true,
    session_number INTEGER,
    lesson_log JSONB,
    needs_log BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.growth_reports (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id),
    teacher_id TEXT NOT NULL REFERENCES public.teachers(id),
    session_cycle INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    title TEXT NOT NULL,
    growth_summary TEXT,
    achievements TEXT,
    next_goals TEXT,
    teacher_message TEXT,
    icloud_video_url TEXT
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'parent')),
    teacher_id TEXT REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    CHECK (
        (role = 'admin' AND teacher_id IS NULL AND student_id IS NULL) OR
        (role = 'teacher' AND teacher_id IS NOT NULL AND student_id IS NULL) OR
        (role = 'parent' AND teacher_id IS NULL AND student_id IS NOT NULL)
    )
);

CREATE INDEX students_teacher_id_idx ON public.students(teacher_id);
CREATE INDEX attendances_student_id_idx ON public.attendances(student_id);
CREATE INDEX attendances_teacher_id_idx ON public.attendances(teacher_id);
CREATE INDEX growth_reports_student_id_idx ON public.growth_reports(student_id);
CREATE INDEX growth_reports_teacher_id_idx ON public.growth_reports(teacher_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_reports ENABLE ROW LEVEL SECURITY;

-- Definer functions avoid recursive profile RLS checks. A user can only inspect
-- their own profile; role and assignment data are never accepted from the client.
CREATE FUNCTION public.current_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())
$$;

CREATE FUNCTION public.current_teacher_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT teacher_id FROM public.profiles WHERE id = (SELECT auth.uid())
$$;

CREATE FUNCTION public.current_student_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT student_id FROM public.profiles WHERE id = (SELECT auth.uid())
$$;

REVOKE ALL ON FUNCTION public.current_role() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_teacher_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_student_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_teacher_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_student_id() TO authenticated;

CREATE POLICY profiles_read_self ON public.profiles
    FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));

CREATE POLICY teachers_read_assigned ON public.teachers
    FOR SELECT TO authenticated
    USING (
        public.current_role() = 'admin' OR
        id = public.current_teacher_id() OR
        id = (SELECT teacher_id FROM public.students
              WHERE id = public.current_student_id())
    );
CREATE POLICY teachers_admin_write ON public.teachers
    FOR ALL TO authenticated
    USING (public.current_role() = 'admin')
    WITH CHECK (public.current_role() = 'admin');

CREATE POLICY payment_details_staff_read ON public.teacher_payment_details
    FOR SELECT TO authenticated
    USING (
        public.current_role() = 'admin' OR
        teacher_id = public.current_teacher_id()
    );
CREATE POLICY payment_details_admin_write ON public.teacher_payment_details
    FOR ALL TO authenticated
    USING (public.current_role() = 'admin')
    WITH CHECK (public.current_role() = 'admin');

CREATE POLICY students_read_assigned ON public.students
    FOR SELECT TO authenticated
    USING (
        public.current_role() = 'admin' OR
        teacher_id = public.current_teacher_id() OR
        id = public.current_student_id()
    );
CREATE POLICY students_admin_write ON public.students
    FOR ALL TO authenticated
    USING (public.current_role() = 'admin')
    WITH CHECK (public.current_role() = 'admin');
CREATE POLICY students_teacher_update ON public.students
    FOR UPDATE TO authenticated
    USING (teacher_id = public.current_teacher_id())
    WITH CHECK (teacher_id = public.current_teacher_id());

CREATE POLICY attendances_read_assigned ON public.attendances
    FOR SELECT TO authenticated
    USING (
        public.current_role() = 'admin' OR
        teacher_id = public.current_teacher_id() OR
        student_id = public.current_student_id()
    );
CREATE POLICY attendances_admin_write ON public.attendances
    FOR ALL TO authenticated
    USING (public.current_role() = 'admin')
    WITH CHECK (public.current_role() = 'admin');
CREATE POLICY attendances_teacher_insert ON public.attendances
    FOR INSERT TO authenticated
    WITH CHECK (
        teacher_id = public.current_teacher_id() AND
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_id AND s.teacher_id = public.current_teacher_id()
        )
    );
CREATE POLICY attendances_teacher_update ON public.attendances
    FOR UPDATE TO authenticated
    USING (teacher_id = public.current_teacher_id())
    WITH CHECK (
        teacher_id = public.current_teacher_id() AND
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_id AND s.teacher_id = public.current_teacher_id()
        )
    );

CREATE POLICY growth_reports_read_assigned ON public.growth_reports
    FOR SELECT TO authenticated
    USING (
        public.current_role() = 'admin' OR
        teacher_id = public.current_teacher_id() OR
        student_id = public.current_student_id()
    );
CREATE POLICY growth_reports_admin_write ON public.growth_reports
    FOR ALL TO authenticated
    USING (public.current_role() = 'admin')
    WITH CHECK (public.current_role() = 'admin');
CREATE POLICY growth_reports_teacher_insert ON public.growth_reports
    FOR INSERT TO authenticated
    WITH CHECK (
        teacher_id = public.current_teacher_id() AND
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_id AND s.teacher_id = public.current_teacher_id()
        )
    );
CREATE POLICY growth_reports_teacher_update ON public.growth_reports
    FOR UPDATE TO authenticated
    USING (teacher_id = public.current_teacher_id())
    WITH CHECK (
        teacher_id = public.current_teacher_id() AND
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_id AND s.teacher_id = public.current_teacher_id()
        )
    );

CREATE FUNCTION public.protect_teacher_student_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF public.current_role() = 'teacher' AND (
        NEW.id IS DISTINCT FROM OLD.id OR
        NEW.teacher_id IS DISTINCT FROM OLD.teacher_id OR
        NEW.name IS DISTINCT FROM OLD.name OR
        NEW.phone IS DISTINCT FROM OLD.phone OR
        NEW.school IS DISTINCT FROM OLD.school OR
        NEW.parent_phone IS DISTINCT FROM OLD.parent_phone OR
        NEW.checkin_code IS DISTINCT FROM OLD.checkin_code OR
        NEW.session_price IS DISTINCT FROM OLD.session_price OR
        NEW.teacher_share IS DISTINCT FROM OLD.teacher_share OR
        NEW.director_share IS DISTINCT FROM OLD.director_share OR
        NEW.registered_at IS DISTINCT FROM OLD.registered_at OR
        NEW.notes IS DISTINCT FROM OLD.notes OR
        NEW.is_deleted IS DISTINCT FROM OLD.is_deleted OR
        NEW.created_at IS DISTINCT FROM OLD.created_at
    ) THEN
        RAISE EXCEPTION 'Teachers may only update the session count'
            USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER protect_teacher_student_fields
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.protect_teacher_student_fields();

CREATE FUNCTION public.set_attendance_snapshots()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    student_row public.students%ROWTYPE;
BEGIN
    SELECT * INTO student_row FROM public.students WHERE id = NEW.student_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student not found' USING ERRCODE = '23503';
    END IF;
    IF public.current_role() = 'teacher'
       AND student_row.teacher_id <> public.current_teacher_id() THEN
        RAISE EXCEPTION 'Teacher is not assigned to this student'
            USING ERRCODE = '42501';
    END IF;
    NEW.teacher_id := student_row.teacher_id;
    NEW.student_name_snapshot := student_row.name;
    NEW.session_price_snapshot := student_row.session_price;
    NEW.teacher_share_snapshot := student_row.teacher_share;
    NEW.director_share_snapshot := student_row.director_share;
    SELECT name INTO NEW.teacher_name_snapshot
      FROM public.teachers WHERE id = student_row.teacher_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_attendance_snapshots
    BEFORE INSERT ON public.attendances
    FOR EACH ROW EXECUTE FUNCTION public.set_attendance_snapshots();

CREATE FUNCTION public.protect_teacher_attendance_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF public.current_role() = 'teacher' AND (
        NEW.id IS DISTINCT FROM OLD.id OR
        NEW.student_id IS DISTINCT FROM OLD.student_id OR
        NEW.teacher_id IS DISTINCT FROM OLD.teacher_id OR
        NEW.student_name_snapshot IS DISTINCT FROM OLD.student_name_snapshot OR
        NEW.teacher_name_snapshot IS DISTINCT FROM OLD.teacher_name_snapshot OR
        NEW.session_price_snapshot IS DISTINCT FROM OLD.session_price_snapshot OR
        NEW.teacher_share_snapshot IS DISTINCT FROM OLD.teacher_share_snapshot OR
        NEW.director_share_snapshot IS DISTINCT FROM OLD.director_share_snapshot OR
        NEW.date IS DISTINCT FROM OLD.date OR
        NEW.timestamp IS DISTINCT FROM OLD.timestamp OR
        NEW.status IS DISTINCT FROM OLD.status OR
        NEW.excuse_reason IS DISTINCT FROM OLD.excuse_reason OR
        NEW.is_counted IS DISTINCT FROM OLD.is_counted OR
        NEW.session_number IS DISTINCT FROM OLD.session_number OR
        NEW.created_at IS DISTINCT FROM OLD.created_at
    ) THEN
        RAISE EXCEPTION 'Teachers may only update lesson notes'
            USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER protect_teacher_attendance_history
    BEFORE UPDATE ON public.attendances
    FOR EACH ROW EXECUTE FUNCTION public.protect_teacher_attendance_history();

REVOKE ALL ON FUNCTION public.protect_teacher_student_fields() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_attendance_snapshots() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.protect_teacher_attendance_history() FROM PUBLIC, anon;

GRANT SELECT ON public.profiles, public.teachers, public.students,
    public.teacher_payment_details, public.attendances, public.growth_reports TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.teachers, public.students,
    public.teacher_payment_details, public.attendances, public.growth_reports TO authenticated;
REVOKE ALL ON public.profiles, public.teachers, public.students,
    public.teacher_payment_details, public.attendances, public.growth_reports FROM anon;

-- Provision profiles only from the SQL editor/service role after creating the
-- Auth user. Example (replace with actual IDs; never commit production IDs):
-- INSERT INTO public.profiles (id, role) VALUES ('<auth-user-uuid>', 'admin');
-- INSERT INTO public.profiles (id, role, teacher_id)
--   VALUES ('<auth-user-uuid>', 'teacher', '<teacher-id>');
-- INSERT INTO public.profiles (id, role, student_id)
--   VALUES ('<auth-user-uuid>', 'parent', '<student-id>');
