// Empty by design: all academy data must come from the authenticated Supabase project.
const DEFAULT_TEACHERS = [];
const DEFAULT_STUDENTS = [];
const DEFAULT_ATTENDANCES = [];
const DEFAULT_GROWTH_REPORTS = [];
const { useState, useEffect, useMemo } = React;

// Icons
const Icons = {
  Academic: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  UserGroup: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  VideoCamera: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Calculator: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
    </svg>
  ),
  DeviceMobile: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
};

function App() {
  const [supabaseConfig] = useState(window.TRINITY_SUPABASE_CONFIG || {});

  const [teachers, setTeachers] = useState(DEFAULT_TEACHERS);
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [attendances, setAttendances] = useState(DEFAULT_ATTENDANCES);
  const [growthReports, setGrowthReports] = useState(DEFAULT_GROWTH_REPORTS);
  const [authSession, setAuthSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [accountPending, setAccountPending] = useState(false);
  const [isInvitationFlow, setIsInvitationFlow] = useState(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const isInvite = hashParams.get("type") === "invite" ||
      new URLSearchParams(window.location.search).get("type") === "invite";
    if (isInvite) window.sessionStorage.setItem("trinity_invitation_flow", "true");
    return isInvite || window.sessionStorage.getItem("trinity_invitation_flow") === "true";
  });
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [dataReady, setDataReady] = useState(false);

  // Kiosk Mode State (Tablet entrance attendance screen)
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [kioskCode, setKioskCode] = useState("");
  const [kioskSuccessStudent, setKioskSuccessStudent] = useState(null);
  const [kioskErrorMessage, setKioskErrorMessage] = useState("");

  const currentRole = profile?.role || null;
  const currentTeacherId = profile?.teacher_id || null;
  const currentStudentId = profile?.student_id || null;

  const [activeTab, setActiveTab] = useState("teachers");

  const isAdminLoggedIn = currentRole === "admin";
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showInviteHelp, setShowInviteHelp] = useState(false);

  // Locked mode for direct student/teacher links (hides role switchers & other students)
  const [shareModalData, setShareModalData] = useState(null);

  // Mobile info modal
  const [isMobileGuideOpen, setIsMobileGuideOpen] = useState(false);

  // Modals
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [targetTeacherForNewStudent, setTargetTeacherForNewStudent] = useState(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceTargetStudent, setAttendanceTargetStudent] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetStudent, setReportTargetStudent] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [excuseTargetStudent, setExcuseTargetStudent] = useState(null);
  const [excuseReasonInput, setExcuseReasonInput] = useState("");

  const [settlementMonth, setSettlementMonth] = useState("2026-11");

  const currentTeacher = teachers.find(t => t.id === currentTeacherId) || teachers[0];
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const supabase = useMemo(() => {
    if (!window.supabase || !supabaseConfig.url || !supabaseConfig.anonKey) return null;
    try {
      return window.supabase.createClient(supabaseConfig.url.trim(), supabaseConfig.anonKey.trim(), {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      return null;
    }
  }, [supabaseConfig]);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }
    let mounted = true;
    const acceptSession = async (session) => {
      if (session) {
        const key = "trinity_auth_started_at";
        const startedAt = Number(window.localStorage.getItem(key));
        if (startedAt && Date.now() - startedAt > 7 * 24 * 60 * 60 * 1000) {
          if (mounted) {
            setAuthSession(null);
            setAuthLoading(false);
            setAuthError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          }
          window.localStorage.removeItem(key);
          window.setTimeout(() => {
            supabase.auth.signOut().then(({ error }) => {
              if (error) throw error;
            }).catch(error => console.error("Expired session sign-out failed:", error));
          }, 0);
          return;
        }
        if (!startedAt) window.localStorage.setItem(key, String(Date.now()));
      } else {
        window.localStorage.removeItem("trinity_auth_started_at");
      }
      if (mounted) {
        setAuthSession(session);
        setAuthLoading(false);
      }
    };
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      return acceptSession(data.session);
    }).catch((error) => {
      console.error("Supabase session lookup failed:", error);
      if (mounted) {
        setAuthError("인증 상태를 확인하지 못했습니다. 페이지를 새로고침해주세요.");
        setAuthLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      acceptSession(session).catch((error) => {
        console.error("Supabase auth state update failed:", error);
        if (mounted) setAuthError("로그인 상태를 갱신하지 못했습니다.");
      });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    let active = true;
    setProfile(null);
    setAccountPending(false);
    setDataReady(false);
    setTeachers([]);
    setStudents([]);
    setAttendances([]);
    setGrowthReports([]);
    if (!supabase || !authSession || isInvitationFlow) return undefined;
    supabase.from("profiles").select("role,teacher_id,student_id")
      .eq("id", authSession.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) {
          if (active) setAccountPending(true);
          return;
        }
        if (!["admin", "teacher", "parent"].includes(data.role)) {
          throw new Error("This account has no valid academy role assignment.");
        }
        if (active) {
          setAccountPending(false);
          setProfile(data);
          setActiveTab(data.role === "admin" ? "teachers" : data.role === "teacher" ? "my_students" : "parent_overview");
        }
      })
      .catch((error) => {
        console.error("Profile lookup failed:", error);
        if (active) setAuthError("계정 권한을 확인하지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요.");
      });
    return () => { active = false; };
  }, [supabase, authSession, isInvitationFlow]);

  useEffect(() => {
    let active = true;
    if (!supabase || !authSession || !profile || isInvitationFlow) return undefined;
    const loadData = async () => {
      try {
        const [tRes, pRes, sRes, aRes, gRes] = await Promise.all([
          supabase.from("teachers").select("*"),
          supabase.from("teacher_payment_details").select("*"),
          supabase.from("students").select("*"),
          supabase.from("attendances").select("*").order("date", { ascending: false }),
          supabase.from("growth_reports").select("*")
        ]);
        for (const result of [tRes, pRes, sRes, aRes, gRes]) {
          if (result.error) throw result.error;
        }
        if (!active) return;
        const paymentDetails = new Map((pRes.data || []).map(detail => [detail.teacher_id, detail.bank_account]));
        setTeachers((tRes.data || []).map(t => ({
          id: t.id, name: t.name, subject: t.subject, phone: t.phone,
          bankAccount: paymentDetails.get(t.id) || "", bio: t.bio, color: t.color || "indigo",
          isDeleted: t.is_deleted || false
        })));
        setStudents((sRes.data || []).map(s => ({
          id: s.id, teacherId: s.teacher_id, name: s.name, phone: s.phone,
          school: s.school, parentPhone: s.parent_phone, checkinCode: s.checkin_code,
          sessionPrice: s.session_price, teacherShare: s.teacher_share,
          directorShare: s.director_share, totalSessions: s.total_sessions,
          registeredAt: s.registered_at, notes: s.notes, isDeleted: s.is_deleted || false
        })));
        setAttendances((aRes.data || []).map(a => ({
          id: a.id, studentId: a.student_id, teacherId: a.teacher_id,
          studentNameSnapshot: a.student_name_snapshot, teacherNameSnapshot: a.teacher_name_snapshot,
          sessionPriceSnapshot: a.session_price_snapshot, teacherShareSnapshot: a.teacher_share_snapshot,
          directorShareSnapshot: a.director_share_snapshot, date: a.date, timestamp: a.timestamp,
          status: a.status, excuseReason: a.excuse_reason, isCounted: a.is_counted,
          sessionNumber: a.session_number, lessonLog: a.lesson_log, needsLog: a.needs_log || false
        })));
        setGrowthReports((gRes.data || []).map(g => ({
          id: g.id, studentId: g.student_id, teacherId: g.teacher_id,
          sessionCycle: g.session_cycle, createdAt: g.created_at, title: g.title,
          growthSummary: g.growth_summary, achievements: g.achievements,
          nextGoals: g.next_goals, teacherMessage: g.teacher_message,
          icloudVideoUrl: g.icloud_video_url
        })));
        setDataReady(true);
        setAuthError("");
      } catch (error) {
        console.error("Authenticated data load failed:", error);
        if (active) setAuthError("학원 데이터를 불러오지 못했습니다. Supabase 스키마와 계정 권한을 확인해주세요.");
      }
    };
    loadData();
    return () => { active = false; };
  }, [supabase, authSession, profile, isInvitationFlow]);

  const syncToServer = async (updatedTeachers, updatedStudents, updatedAttendances, updatedReports) => {
    if (!supabase || !authSession || !profile || !dataReady || profile.role === "parent") return;
    const writes = [];
    if (profile.role === "admin" && updatedTeachers.length) {
      writes.push(supabase.from("teachers").upsert(updatedTeachers.map(t => ({
        id: t.id, name: t.name, subject: t.subject, phone: t.phone,
        bio: t.bio, color: t.color, is_deleted: !!t.isDeleted
      }))));
      const paymentDetails = updatedTeachers.filter(t => t.bankAccount).map(t => ({
        teacher_id: t.id, bank_account: t.bankAccount
      }));
      if (paymentDetails.length) {
        writes.push(supabase.from("teacher_payment_details").upsert(paymentDetails));
      }
    }
    if (profile.role === "admin" && updatedStudents.length) {
      writes.push(supabase.from("students").upsert(updatedStudents.map(s => ({
        id: s.id, teacher_id: s.teacherId, name: s.name, phone: s.phone, school: s.school,
        parent_phone: s.parentPhone, checkin_code: s.checkinCode,
        session_price: s.sessionPrice, teacher_share: s.teacherShare,
        director_share: s.directorShare, total_sessions: s.totalSessions,
        registered_at: s.registeredAt, notes: s.notes, is_deleted: !!s.isDeleted
      }))));
    } else if (profile.role === "teacher" && updatedStudents.length) {
      writes.push(...updatedStudents.map(s => supabase.from("students")
        .update({ total_sessions: s.totalSessions }).eq("id", s.id)));
    }
    if (updatedAttendances.length) {
      writes.push(supabase.from("attendances").upsert(updatedAttendances.map(a => ({
        id: a.id, student_id: a.studentId, teacher_id: a.teacherId,
        student_name_snapshot: a.studentNameSnapshot, teacher_name_snapshot: a.teacherNameSnapshot,
        session_price_snapshot: a.sessionPriceSnapshot, teacher_share_snapshot: a.teacherShareSnapshot,
        director_share_snapshot: a.directorShareSnapshot, date: a.date, timestamp: a.timestamp,
        status: a.status, excuse_reason: a.excuseReason, is_counted: a.isCounted,
        session_number: a.sessionNumber, lesson_log: a.lessonLog, needs_log: !!a.needsLog
      }))));
    }
    if (updatedReports.length) {
      writes.push(supabase.from("growth_reports").upsert(updatedReports.map(g => ({
        id: g.id, student_id: g.studentId, teacher_id: g.teacherId,
        session_cycle: g.sessionCycle, created_at: g.createdAt, title: g.title,
        growth_summary: g.growthSummary, achievements: g.achievements,
        next_goals: g.nextGoals, teacher_message: g.teacherMessage,
        icloud_video_url: g.icloudVideoUrl
      }))));
    }
    try {
      const results = await Promise.all(writes);
      const failure = results.find(result => result.error);
      if (failure) throw failure.error;
    } catch (error) {
      console.error("Supabase sync failed:", error);
      setAuthError("저장하지 못했습니다. 계정 권한을 확인하고 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    syncToServer(teachers, students, attendances, growthReports);
  }, [teachers, students, attendances, growthReports, authSession, profile, dataReady]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isKiosk = params.get("mode") === "kiosk" || params.get("kiosk") === "1";
    if (isKiosk && authSession && (profile?.role === "admin" || profile?.role === "teacher")) {
      setIsKioskMode(true);
    }
  }, [authSession, profile]);

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url.toString();
  };

  const openShareModal = (type, item) => {
    const link = getShareUrl();
    const title = type === "parent"
      ? `${item.name} 학생 학부모 계정 안내`
      : `${item.name} 선생님 계정 안내`;
    const message = `[트리니티 음악학원] 계정에 등록된 이메일로 로그인해 주세요.

${link}

이 링크는 인증을 대신하지 않습니다. 각 계정은 Supabase 프로필에 연결된 데이터만 확인할 수 있습니다.`;
    setShareModalData({ type, item, link, title, message });
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthError("");
    if (!supabase) {
      setAuthError("Supabase 설정을 찾을 수 없습니다. 배포 설정 파일을 확인해주세요.");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(), password: loginPassword
      });
      if (error) throw error;
      window.localStorage.setItem("trinity_auth_started_at", String(Date.now()));
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error("Supabase sign-in failed:", error);
      setAuthError("로그인하지 못했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const clearInvitationFlow = () => {
    window.sessionStorage.removeItem("trinity_invitation_flow");
    const callbackUrl = new URL(window.location.href);
    ["type", "token_hash", "code", "error", "error_description"].forEach(key => callbackUrl.searchParams.delete(key));
    callbackUrl.hash = "";
    window.history.replaceState(null, "", `${callbackUrl.pathname}${callbackUrl.search}`);
    setIsInvitationFlow(false);
  };

  const handleCompleteInvitation = async (event) => {
    event.preventDefault();
    setAuthError("");
    if (!supabase) {
      setAuthError("Supabase 설정을 찾을 수 없습니다. 배포 설정 파일을 확인해주세요.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setAuthError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setNewPasswordConfirm("");
      clearInvitationFlow();
    } catch (error) {
      console.error("Invitation password setup failed:", error);
      setAuthError("초대 계정을 설정하지 못했습니다. 초대 링크가 유효한지, 새 비밀번호가 Supabase 정책을 충족하는지 확인해주세요.");
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setProfile(null);
    setDataReady(false);
    setTeachers([]);
    setStudents([]);
    setAttendances([]);
    setGrowthReports([]);
    setAccountPending(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsInvitationFlow(false);
      window.sessionStorage.removeItem("trinity_invitation_flow");
    } catch (error) {
      console.error("Supabase sign-out failed:", error);
      setAuthError("로그아웃하지 못했습니다. 다시 시도해주세요.");
    }
  };

  const getFormattedNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return {
      dateString: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      timestampString: `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`
    };
  };

  // Mark Present (With snapshots of student name, teacher, and custom pricing)
  const handleMarkPresent = (student, isFromKiosk = false) => {
    const { dateString, timestampString } = getFormattedNow();
    const nextSession = (student.totalSessions || 0) + 1;
    const teacher = teachers.find(t => t.id === student.teacherId);

    const sessionPrice = student.sessionPrice || 45000;
    const teacherShare = student.teacherShare || (sessionPrice / 2);
    const directorShare = student.directorShare || (sessionPrice - teacherShare);

    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, totalSessions: nextSession } : s));

    const newRecord = {
      id: "att_" + Date.now(),
      studentId: student.id,
      teacherId: student.teacherId,
      studentNameSnapshot: student.name,
      teacherNameSnapshot: teacher ? teacher.name : "미지정",
      sessionPriceSnapshot: sessionPrice,
      teacherShareSnapshot: teacherShare,
      directorShareSnapshot: directorShare,
      date: dateString,
      timestamp: timestampString,
      status: "present",
      excuseReason: "",
      isCounted: true,
      needsLog: true, // Highlights teacher card until lesson log is completed!
      sessionNumber: nextSession,
      lessonLog: {
        lessonPoints: ["", "", ""],
        homeworkPoints: ["", "", ""]
      }
    };

    setAttendances(prev => [newRecord, ...prev]);

    if (!isFromKiosk) {
      setAttendanceTargetStudent({ student, record: newRecord });
      setIsAttendanceModalOpen(true);
    }
  };

    // Kiosk 6-Digit Code Attendance Handler
  const handleKioskCheckin = (codeToTest = kioskCode) => {
    const code = codeToTest.trim();
    if (code.length !== 6) {
      setKioskErrorMessage("6자리 숫자를 입력해주세요.");
      return;
    }

    const matchedStudent = students.find(s => !s.isDeleted && s.checkinCode === code);
    if (!matchedStudent) {
      setKioskErrorMessage("일치하는 학생 코드가 없습니다. 번호를 다시 확인해주세요.");
      // Auto clear error after 3s
      setTimeout(() => setKioskErrorMessage(""), 3000);
      return;
    }

    // Process Attendance
    handleMarkPresent(matchedStudent, true);
    setKioskSuccessStudent(matchedStudent);
    setKioskCode("");
    setKioskErrorMessage("");

    // TTS Voice greeting
    try {
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(`${matchedStudent.name} 학생 출석이 완료되었습니다. 환영합니다!`);
        speech.lang = 'ko-KR';
        speech.rate = 1.0;
        window.speechSynthesis.speak(speech);
      }
    } catch (e) {}

    // Auto reset success message after 3.5 seconds
    setTimeout(() => {
      setKioskSuccessStudent(null);
    }, 3500);
  };

  // Mark Absent Deducted
  const handleMarkAbsentDeducted = (student) => {
    const confirmDeduct = confirm(
      `[당일 무단결석 처리 안내]\n\n학생: ${student.name}\n당일 취소/결석으로 인해 학원 규정에 따라 정상적으로 1회차가 차감되고 정산에 포함됩니다.\n\n계속 진행하시겠습니까?`
    );
    if (!confirmDeduct) return;

    const { dateString, timestampString } = getFormattedNow();
    const nextSession = (student.totalSessions || 0) + 1;

    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, totalSessions: nextSession } : s));

    const newRecord = {
      id: "att_" + Date.now(),
      studentId: student.id,
      teacherId: student.teacherId,
      date: dateString,
      timestamp: timestampString,
      status: "absent_deducted",
      excuseReason: "당일 무단결석 (수업 회차 1회 차감 처리)",
      isCounted: true,
      sessionNumber: nextSession,
      lessonLog: null
    };

    setAttendances(prev => [newRecord, ...prev]);
    alert(`${student.name} 학생의 당일 무단결석(1회차 차감)이 기록되었습니다.`);
  };

  // Mark Excuse
  const handleOpenExcuseModal = (student) => {
    setExcuseTargetStudent(student);
    setExcuseReasonInput("");
    setIsExcuseModalOpen(true);
  };

  const handleSaveExcuse = () => {
    if (!excuseReasonInput.trim()) {
      alert("결석 사유를 간단히 입력해주세요.");
      return;
    }
    const { dateString, timestampString } = getFormattedNow();

    const newRecord = {
      id: "att_" + Date.now(),
      studentId: excuseTargetStudent.id,
      teacherId: excuseTargetStudent.teacherId,
      date: dateString,
      timestamp: timestampString,
      status: "absent_excused",
      excuseReason: excuseReasonInput.trim(),
      isCounted: false,
      sessionNumber: null,
      lessonLog: null
    };

    setAttendances(prev => [newRecord, ...prev]);
    setIsExcuseModalOpen(false);
    alert(`${excuseTargetStudent.name} 학생의 사유 결석이 등록되었습니다.`);
  };

  const handleDeleteAttendance = (attId) => {
    if (confirm("이 출석/결석 기록을 삭제하시겠습니까?")) {
      setAttendances(prev => prev.filter(a => a.id !== attId));
    }
  };

  const handleOpenReportModal = (student, existingReport = null) => {
    setReportTargetStudent(student);
    setEditingReport(existingReport ? { ...existingReport } : {
      id: "rep_" + Date.now(),
      studentId: student.id,
      teacherId: student.teacherId,
      sessionCycle: student.totalSessions || 4,
      createdAt: getFormattedNow().dateString,
      title: `${student.name} 학생 ${student.totalSessions || 4}회차 정기 성장 리포트`,
      growthSummary: "",
      achievements: "",
      nextGoals: "",
      teacherMessage: "",
      icloudVideoUrl: ""
    });
    setIsReportModalOpen(true);
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    if (!editingReport.title.trim()) {
      alert("리포트 제목을 입력해주세요.");
      return;
    }

    setGrowthReports(prev => {
      const exists = prev.some(r => r.id === editingReport.id);
      if (exists) {
        return prev.map(r => r.id === editingReport.id ? editingReport : r);
      } else {
        return [editingReport, ...prev];
      }
    });

    setIsReportModalOpen(false);
    alert("성장 리포트와 영상 링크가 저장되었습니다!");
  };

  // 3.3% Tax & Settlement Calculation Logic
  const settlementSummary = useMemo(() => {
    const PRICE_PER_SESSION = 45000;
    const DIRECTOR_SHARE_PER_SESSION = 22500;
    const TEACHER_SHARE_PER_SESSION = 22500;

    const monthlyRecords = attendances.filter(att => {
      if (!att.isCounted) return false;
      return att.date && att.date.startsWith(settlementMonth);
    });

    const totalSessions = monthlyRecords.length;
    const totalTuitionRevenue = totalSessions * PRICE_PER_SESSION;
    const totalDirectorShare = totalSessions * DIRECTOR_SHARE_PER_SESSION;

    let totalGrossPay = 0;
    let totalIncomeTax = 0;
    let totalLocalTax = 0;
    let totalTaxDeducted = 0;
    let totalNetPayToTeachers = 0;

    // Calculate breakdown for active and deleted teachers who have records
    const allTeacherIds = Array.from(new Set([...teachers.map(t => t.id), ...monthlyRecords.map(r => r.teacherId)]));

    const teacherBreakdown = allTeacherIds.map(tid => {
      const existingTeacher = teachers.find(t => t.id === tid);
      const teacherRecords = monthlyRecords.filter(r => r.teacherId === tid);
      const sessionCount = teacherRecords.length;

      // Custom pricing per session calculation (respects custom student/instrument rates)
      let totalAmount = 0;
      let grossPay = 0;
      let directorEarned = 0;

      teacherRecords.forEach(r => {
        const st = students.find(s => s.id === r.studentId);
        const sPrice = r.sessionPriceSnapshot || (st && st.sessionPrice) || 45000;
        const tShare = r.teacherShareSnapshot || (st && st.teacherShare) || (sPrice / 2);
        const dShare = r.directorShareSnapshot || (st && st.directorShare) || (sPrice - tShare);

        totalAmount += sPrice;
        grossPay += tShare;
        directorEarned += dShare;
      });

      // 3.3% Tax calculation
      const incomeTax = Math.floor((grossPay * 0.03) / 10) * 10;
      const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
      const totalTax = incomeTax + localTax;
      const netPay = grossPay - totalTax;

      const tObj = existingTeacher || {
        id: tid,
        name: teacherRecords[0]?.teacherNameSnapshot || "퇴사/삭제된 선생님",
        subject: "기타",
        bankAccount: "정보 보존됨",
        isDeleted: true
      };

      totalGrossPay += grossPay;
      totalIncomeTax += incomeTax;
      totalLocalTax += localTax;
      totalTaxDeducted += totalTax;
      totalNetPayToTeachers += netPay;

      return {
        teacher: tObj,
        sessionCount,
        grossPay,
        incomeTax,
        localTax,
        totalTax,
        netPay,
        directorEarned,
        totalAmount,
        records: teacherRecords
      };
    });

    return {
      month: settlementMonth,
      totalSessions,
      totalTuitionRevenue,
      totalDirectorShare,
      totalGrossPay,
      totalIncomeTax,
      totalLocalTax,
      totalTaxDeducted,
      totalNetPayToTeachers,
      teacherBreakdown,
      PRICE_PER_SESSION,
      DIRECTOR_SHARE_PER_SESSION,
      TEACHER_SHARE_PER_SESSION
    };
  }, [attendances, teachers, settlementMonth]);

  // Copy Settlement Data formatted for Google Sheets (TSV format)
  const handleCopyForGoogleSheets = () => {
    const headers = [
      "정산연월",
      "선생님명",
      "담당과목",
      "정산 입금계좌",
      "수업횟수(회)",
      "수강료총액(원)",
      "원장님수익(원)",
      "3.3%전 세전강사료(원)",
      "소득세 3%(원)",
      "지방소득세 0.3%(원)",
      "원천징수세액 합계(3.3%)",
      "실제 송금액 (3.3%차감후)"
    ].join("\t");

    const rows = settlementSummary.teacherBreakdown.map(item => [
      settlementMonth,
      item.teacher.name,
      item.teacher.subject,
      item.teacher.bankAccount || "계좌 미등록",
      item.sessionCount,
      item.totalAmount,
      item.directorEarned,
      item.grossPay,
      item.incomeTax,
      item.localTax,
      item.totalTax,
      item.netPay
    ].join("\t"));

    const summaryRow = [
      `${settlementMonth} 합계`,
      `총 ${teachers.length}명`,
      "-",
      "-",
      settlementSummary.totalSessions,
      settlementSummary.totalTuitionRevenue,
      settlementSummary.totalDirectorShare,
      settlementSummary.totalGrossPay,
      settlementSummary.totalIncomeTax,
      settlementSummary.totalLocalTax,
      settlementSummary.totalTaxDeducted,
      settlementSummary.totalNetPayToTeachers
    ].join("\t");

    const tsvContent = [headers, ...rows, summaryRow].join("\n");

    navigator.clipboard.writeText(tsvContent).then(() => {
      alert(
        `[구글 스프레드시트 복사 완료!]\n\n` +
        `구글 스프레드시트 또는 엑셀의 빈 셀(A1)을 클릭하고 [Ctrl+V] (또는 Cmd+V) 하시면\n` +
        `모든 열(선생님명, 계좌, 수업수, 세전금액, 3.3%세금, 실제송금액, 원장님수익)이\n` +
        `표 격자 형태로 완벽하게 붙여넣어집니다!`
      );
    }).catch(err => {
      alert("복사 중 오류가 발생했습니다. 브라우저 권한을 확인해주세요.");
    });
  };

  // Download CSV File for Excel / Sheets
  const handleDownloadCSV = () => {
    const headers = [
      "정산연월", "선생님명", "담당과목", "정산 입금계좌", "수업횟수(회)",
      "수강료총액", "원장님수익", "3.3%전_세전금액", "소득세_3%",
      "지방소득세_0.3%", "원천징수세합계_3.3%", "실제송금액_3.3%차감후"
    ].join(",");

    const rows = settlementSummary.teacherBreakdown.map(item => [
      `"${settlementMonth}"`,
      `"${item.teacher.name}"`,
      `"${item.teacher.subject}"`,
      `"${item.teacher.bankAccount || ''}"`,
      item.sessionCount,
      item.totalAmount,
      item.directorEarned,
      item.grossPay,
      item.incomeTax,
      item.localTax,
      item.totalTax,
      item.netPay
    ].join(","));

    const summaryRow = [
      `"${settlementMonth} 합계"`, `"${teachers.length}명"`, `"-"`, `"-"`,
      settlementSummary.totalSessions,
      settlementSummary.totalTuitionRevenue,
      settlementSummary.totalDirectorShare,
      settlementSummary.totalGrossPay,
      settlementSummary.totalIncomeTax,
      settlementSummary.totalLocalTax,
      settlementSummary.totalTaxDeducted,
      settlementSummary.totalNetPayToTeachers
    ].join(",");

    const csvContent = "\uFEFF" + [headers, ...rows, summaryRow].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `트리니티음악학원_정산및세무_${settlementMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-20 md:pb-6">
      {/* 1. Global Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
                <Icons.Academic />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">트리니티 음악학원</span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    모바일 & PC
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">Trinity Music Academy • 출석·성장리포트 & 정산</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {(currentRole === "admin" || currentRole === "teacher") && (
                <button
                  onClick={() => setIsKioskMode(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-extrabold border border-purple-200"
                >
                  📱 <span className="hidden sm:inline">입구 키오스크</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileGuideOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/60"
              >
                <Icons.DeviceMobile />
              </button>
              {authSession && (
                <>
                  <span className="text-xs font-semibold text-slate-600">
                    {currentRole === "admin" ? "관리자" : currentRole === "teacher" ? "선생님" : currentRole === "parent" ? "학부모" : "권한 확인 중"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200/60"
                  >로그아웃</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Tab Bar */}
        <div className="hidden md:block bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-2">
            {currentRole === "admin" && isAdminLoggedIn && (
              <div className="flex space-x-2 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("teachers")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "teachers" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.UserGroup />
                  <span>선생님 & 학생 관리 (매핑)</span>
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "attendance" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Clock />
                  <span>출석부 & 수업 일지 총괄</span>
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "reports" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Sparkles />
                  <span>4회차 성장 리포트 & 영상</span>
                </button>
                <button
                  onClick={() => setActiveTab("settlement")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "settlement" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Calculator />
                  <span>수강료 & 정산 자동화 대시보드</span>
                </button>
              </div>
            )}

            {currentRole === "teacher" && (
              <div className="flex space-x-2 text-xs font-medium">
                <span className="font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 mr-2 flex items-center">
                  {currentTeacher?.name} 모드
                </span>
                <button
                  onClick={() => setActiveTab("my_students")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "my_students" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.UserGroup />
                  <span>내 담당 학생 & 출석 체크</span>
                </button>
                <button
                  onClick={() => setActiveTab("my_attendance")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "my_attendance" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.BookOpen />
                  <span>수업 일지 및 과제 기록</span>
                </button>
                <button
                  onClick={() => setActiveTab("my_reports")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "my_reports" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Sparkles />
                  <span>4회차 성장 리포트 작성</span>
                </button>
                <button
                  onClick={() => setActiveTab("my_settlement")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "my_settlement" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Calculator />
                  <span>내 수업 정산 현황</span>
                </button>
              </div>
            )}

            {currentRole === "parent" && (
              <div className="flex space-x-2 text-xs font-medium">
                <span className="font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800 mr-2 flex items-center">
                  {currentStudent?.name} 학생 학부모 알림장
                </span>
                <button
                  onClick={() => setActiveTab("parent_overview")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "parent_overview" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Academic />
                  <span>자녀 알림장 홈</span>
                </button>
                <button
                  onClick={() => setActiveTab("parent_attendance")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "parent_attendance" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Clock />
                  <span>실시간 출석 현황</span>
                </button>
                <button
                  onClick={() => setActiveTab("parent_log")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "parent_log" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.BookOpen />
                  <span>수업 내용 & 과제</span>
                </button>
                <button
                  onClick={() => setActiveTab("parent_report")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                    activeTab === "parent_report" ? "bg-white text-brand-700 shadow-xs border border-slate-200 font-bold" : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <Icons.Sparkles />
                  <span>4회차 성장 리포트 & iCloud 영상</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ========================================================================= */}
        {/* ADMIN VIEWS (Protected by Login Screen)                                   */}
        {/* ========================================================================= */}
        {!authSession && !isInvitationFlow && (
          <div className="min-h-[70vh] flex items-center justify-center py-8">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900">트리니티 음악학원</h2>
                <p className="text-xs text-slate-500 mt-2">Supabase 계정으로 로그인하세요. 선생님 계정은 관리자가 발급한 초대 링크로만 등록할 수 있습니다.</p>
              </div>
              {authLoading && <p className="text-sm text-center text-slate-500">인증 상태 확인 중...</p>}
              {!supabase && <p className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">Supabase 연결 설정이 없습니다. 배포 환경에 supabase-config.js를 추가해주세요.</p>}
              {authError && <p role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{authError}</p>}
              {showInviteHelp ? (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800">선생님 초대 등록</h3>
                  <p className="text-xs leading-relaxed text-slate-600">선생님 계정은 공개 회원가입으로 만들 수 없습니다. 학원 관리자에게 초대를 요청하세요. 관리자가 Supabase Auth 초대를 보내고 계정과 교사 정보를 연결하면, 이메일의 초대 링크에서 비밀번호를 설정할 수 있습니다.</p>
                  <button type="button" onClick={() => setShowInviteHelp(false)} className="w-full py-2 text-xs font-bold text-brand-700 hover:bg-brand-50 rounded-xl">로그인으로 돌아가기</button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">이메일
                      <input type="email" required autoComplete="username" value={loginEmail} onChange={event => setLoginEmail(event.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl" />
                    </label>
                    <label className="block text-xs font-bold text-slate-700">비밀번호
                      <input type="password" required autoComplete="current-password" value={loginPassword} onChange={event => setLoginPassword(event.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl" />
                    </label>
                    <p className="text-[11px] text-slate-500">로그인 세션은 최대 7일간 유지됩니다. 접근 권한은 서버의 Supabase 프로필과 RLS 정책으로 결정됩니다.</p>
                    <button type="submit" disabled={!supabase || authLoading} className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-black text-sm">로그인</button>
                  </form>
                  <button type="button" onClick={() => setShowInviteHelp(true)} className="w-full py-2 text-xs font-bold text-brand-700 hover:bg-brand-50 rounded-xl">
                    선생님 초대 등록 방법
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        {!authSession && isInvitationFlow && (
          <div className="max-w-xl mx-auto mt-12 p-5 bg-white border border-brand-200 rounded-2xl space-y-3">
            <h2 className="font-bold text-slate-900">초대 링크 확인 중</h2>
            <p className="text-sm text-slate-700">Supabase가 초대 링크를 확인하고 있습니다. 링크가 만료되었거나 이미 사용되었다면 관리자에게 새 초대를 요청해주세요.</p>
            {authLoading && <p className="text-sm text-slate-500">인증 상태 확인 중...</p>}
            {!supabase && <p role="alert" className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">Supabase 연결 설정이 없어 초대를 확인할 수 없습니다. 배포 설정 파일을 확인해주세요.</p>}
            {authError && <p role="alert" className="text-sm text-red-700">{authError}</p>}
            <button type="button" onClick={clearInvitationFlow} className="text-xs font-bold text-brand-700 hover:underline">로그인 화면으로 돌아가기</button>
          </div>
        )}
        {authSession && isInvitationFlow && (
          <div className="max-w-xl mx-auto mt-12 p-5 bg-white border border-brand-200 rounded-2xl space-y-4">
            <h2 className="font-bold text-slate-900">선생님 계정 등록</h2>
            <p className="text-sm text-slate-700">{authSession.user.email} 초대 계정에 사용할 비밀번호를 설정하세요. 등록된 역할과 담당 학생은 관리자가 미리 연결하며, 이 화면에서는 권한이나 학원 데이터를 변경하지 않습니다.</p>
            {authError && <p role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{authError}</p>}
            <form onSubmit={handleCompleteInvitation} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">새 비밀번호
                <input type="password" required autoComplete="new-password" value={newPassword} onChange={event => setNewPassword(event.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl" />
              </label>
              <label className="block text-xs font-bold text-slate-700">비밀번호 확인
                <input type="password" required autoComplete="new-password" value={newPasswordConfirm} onChange={event => setNewPasswordConfirm(event.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl" />
              </label>
              <button type="submit" disabled={!supabase} className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-black text-sm">비밀번호 설정 후 계속</button>
            </form>
            <button type="button" onClick={handleSignOut} className="text-xs font-bold text-slate-500 hover:underline">초대 취소하고 로그아웃</button>
          </div>
        )}
        {authSession && accountPending && (
          <div className="max-w-xl mx-auto mt-12 p-5 bg-white border border-amber-200 rounded-2xl space-y-3">
            <h2 className="font-bold text-slate-900">계정 권한 등록이 필요합니다</h2>
            <p className="text-sm text-slate-700">이 계정에 연결된 교사 프로필이 없습니다. 관리자가 Supabase에서 계정과 교사 정보를 연결할 때까지 학원 데이터 접근은 차단됩니다.</p>
            <button type="button" onClick={handleSignOut} className="px-3 py-2 text-xs font-bold text-red-700 bg-red-50 rounded-lg">로그아웃</button>
          </div>
        )}
        {authSession && !profile && !accountPending && (
          <div className="max-w-xl mx-auto mt-12 p-5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700">
            {authError || "계정 권한을 확인하고 있습니다..."}
          </div>
        )}
        {authSession && authError && profile && (
          <div role="alert" className="max-w-xl mx-auto mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{authError}</div>
        )}

        {currentRole === "admin" && isAdminLoggedIn && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500">등록 선생님</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{teachers.length}명</div>
              </div>
              <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500">수강 학생</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{students.length}명</div>
              </div>
              <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{settlementMonth} 수업수</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{settlementSummary.totalSessions}회</div>
              </div>
              <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500">원장님 수익</span>
                <div className="text-lg sm:text-2xl font-black text-brand-700 mt-1 truncate">
                  {settlementSummary.totalDirectorShare.toLocaleString()}원
                </div>
              </div>
            </div>

            {/* TAB 1: Teachers */}
            {activeTab === "teachers" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">선생님 목록 & 담당 학생 매핑</h2>
                    <p className="text-xs text-slate-500">선생님을 등록하고 각 선생님 폴더에 담당 학생을 배정합니다.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTeacher({ id: "t_" + Date.now(), name: "", subject: "", phone: "", bio: "", color: "indigo" });
                      setIsTeacherModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs self-stretch sm:self-auto"
                  >
                    <Icons.Plus />
                    <span>새 선생님 등록</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {teachers.map(teacher => {
                    const assignedStudents = students.filter(s => s.teacherId === teacher.id);
                    return (
                      <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-base">
                              {teacher.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900">{teacher.name}</h3>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold">{teacher.subject}</span>
                              </div>
                              <p className="text-xs text-slate-500">{teacher.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openShareModal("teacher", teacher)}
                              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg text-xs flex items-center space-x-1"
                              title="선생님 전용 비공개 접속 링크 복사"
                            >
                              <span>🔗</span>
                              <span>링크 공유</span>
                            </button>
                            <button
                              onClick={() => { setEditingTeacher(teacher); setIsTeacherModalOpen(true); }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => {
                                if (assignedStudents.length > 0) {
                                  alert(`담당 학생이 ${assignedStudents.length}명 있어 삭제할 수 없습니다.`);
                                  return;
                                }
                                if (confirm(`${teacher.name} 선생님을 삭제하시겠습니까?`)) {
                                  setTeachers(prev => prev.filter(t => t.id !== teacher.id));
                                }
                              }}
                              className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        {/* Students Inside Teacher */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700">
                              담당 학생 ({assignedStudents.length}명)
                            </span>
                            <button
                              onClick={() => {
                                setTargetTeacherForNewStudent(teacher.id);
                                setEditingStudent({
                                  id: "s_" + Date.now(),
                                  teacherId: teacher.id,
                                  name: "",
                                  phone: "",
                                  school: "",
                                  parentPhone: "",
                                  notes: "",
                                  totalSessions: 0,
                                  registeredAt: getFormattedNow().dateString
                                });
                                setIsStudentModalOpen(true);
                              }}
                              className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1"
                            >
                              <Icons.Plus />
                              <span>학생 추가</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {assignedStudents.map(student => (
                              <div key={student.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-sm text-slate-900">{student.name}</span>
                                    <span className="text-xs text-slate-500">{student.school}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                      {student.totalSessions || 0}회차
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    학부모: {student.parentPhone} • 학생: {student.phone || "미입력"}
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => openShareModal("parent", student)}
                                    className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 rounded-lg flex items-center space-x-1"
                                    title="학부모님께 카카오톡으로 보낼 전용 알림장 링크 복사"
                                  >
                                    <span>💌</span>
                                    <span>알림장 링크</span>
                                  </button>
                                  <button
                                    onClick={() => { setEditingStudent(student); setIsStudentModalOpen(true); }}
                                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`${student.name} 학생을 삭제하시겠습니까?`)) {
                                        setStudents(prev => prev.filter(s => s.id !== student.id));
                                      }
                                    }}
                                    className="px-2 py-1 text-xs bg-white border border-slate-200 text-red-500 rounded-lg"
                                  >
                                    삭제
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Attendance */}
            {activeTab === "attendance" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <h2 className="text-base font-bold text-slate-900">전체 출석부 & 수업 일지</h2>
                  <p className="text-xs text-slate-500">정확한 타임스탬프와 수업 일지(3가지) 및 과제(3가지) 목록입니다.</p>
                </div>

                <div className="space-y-3">
                  {attendances.map(att => {
                    const st = students.find(s => s.id === att.studentId);
                    const tc = teachers.find(t => t.id === att.teacherId);
                    return (
                      <div key={att.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <div className="font-bold text-sm text-slate-900">{st?.name} ({tc?.name})</div>
                            <div className="text-xs text-slate-500">{att.timestamp} ({att.sessionNumber || "N"}회차)</div>
                          </div>
                          <div>
                            {att.status === "present" && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">✓ 출석</span>
                            )}
                            {att.status === "absent_deducted" && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">✕ 당일결석(차감)</span>
                            )}
                            {att.status === "absent_excused" && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">✎ 사유결석</span>
                            )}
                          </div>
                        </div>

                        {att.excuseReason && (
                          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl italic">
                            사유: {att.excuseReason}
                          </div>
                        )}

                        {att.lessonLog && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-xl">
                              <span className="font-bold text-brand-800 block mb-1">수업 내용 3가지</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                {att.lessonLog.lessonPoints?.filter(p => p.trim()).map((p, idx) => (
                                  <li key={idx} className="truncate">{p}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl">
                              <span className="font-bold text-emerald-800 block mb-1">과제 3가지</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                {att.lessonLog.homeworkPoints?.filter(p => p.trim()).map((p, idx) => (
                                  <li key={idx} className="truncate">{p}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="text-right pt-1">
                          <button
                            onClick={() => handleDeleteAttendance(att.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Reports */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <h2 className="text-base font-bold text-slate-900">4회차 성장 리포트 & iCloud 영상 링크</h2>
                  <p className="text-xs text-slate-500">4주 단위 성장 리포트와 학부모 전용 영상 링크입니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthReports.map(rep => {
                    const st = students.find(s => s.id === rep.studentId);
                    const tc = teachers.find(t => t.id === rep.teacherId);
                    return (
                      <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {rep.sessionCycle}회차 성장 리포트
                            </span>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">{rep.title}</h3>
                            <p className="text-xs text-slate-500">{st?.name} ({st?.school}) • 지도: {tc?.name}</p>
                          </div>
                          <button
                            onClick={() => handleOpenReportModal(st, rep)}
                            className="text-xs font-bold text-brand-600 hover:underline"
                          >
                            수정
                          </button>
                        </div>

                        <div className="text-xs text-slate-700 space-y-2">
                          <p className="bg-slate-50 p-2.5 rounded-xl whitespace-pre-line">{rep.growthSummary}</p>
                        </div>

                        {rep.icloudVideoUrl && (
                          <div className="pt-2 border-t border-slate-100">
                            <a
                              href={rep.icloudVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                            >
                              <Icons.VideoCamera />
                              <span>iCloud 연주 영상 보기 ↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: Settlement with 3.3% Tax & Google Sheets Export */}
            {activeTab === "settlement" && (
              <div className="space-y-5">
                {/* Control & Actions Bar */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-black text-slate-900">{settlementMonth} 월말 정산 & 세무 대시보드</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                        3.3% 원천징수 자동계산
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      기준: 5회 18만원(회당 45,000원) • 원장님 22,500원 / 선생님 22,500원 • <strong>월말 정산 및 3.3% 세무 신고용</strong>
                    </p>
                  </div>

                  {/* Actions: Month Picker + Google Sheets 1-Click Copy */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="month"
                      value={settlementMonth}
                      onChange={(e) => setSettlementMonth(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    />

                    {/* Google Sheets 1-Click Copy Button */}
                    <button
                      onClick={handleCopyForGoogleSheets}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                      title="구글 스프레드시트 또는 엑셀에 바로 붙여넣을 수 있게 복사"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>📋 구글 시트 복사</span>
                    </button>

                    {/* CSV Download Button */}
                    <button
                      onClick={handleDownloadCSV}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                      title="엑셀 CSV 파일 다운로드"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>CSV 다운로드</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors no-print"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>인쇄</span>
                    </button>
                  </div>
                </div>

                {/* 5 Financial KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Card 1: Total Sessions */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] opacity-75 block">진행 수업 횟수</span>
                    <div className="text-2xl font-black mt-1">{settlementSummary.totalSessions} <span className="text-xs font-normal opacity-80">회</span></div>
                    <span className="text-[10px] opacity-60">출석 + 무단결석(차감)</span>
                  </div>

                  {/* Card 2: Total Revenue */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 block">학원 총 수강료 매출</span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 truncate">
                      {settlementSummary.totalTuitionRevenue.toLocaleString()}<span className="text-xs font-normal text-slate-500">원</span>
                    </div>
                    <span className="text-[10px] text-slate-400">회당 45,000원 기준</span>
                  </div>

                  {/* Card 3: Director Profit */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-brand-200 bg-brand-50/20 shadow-xs">
                    <span className="text-[11px] font-bold text-brand-800 block">👑 원장님 순수익 (내 몫)</span>
                    <div className="text-lg sm:text-xl font-black text-brand-700 mt-1 truncate">
                      {settlementSummary.totalDirectorShare.toLocaleString()}<span className="text-xs font-normal text-brand-600">원</span>
                    </div>
                    <span className="text-[10px] text-brand-600 font-semibold">회당 22,500원 (50%)</span>
                  </div>

                  {/* Card 4: Net Pay to Teachers (Actual Transfer) */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold opacity-90 block">💸 실제 송금할 돈 (3.3% 뗀 후)</span>
                    <div className="text-lg sm:text-xl font-black mt-1 truncate">
                      {settlementSummary.totalNetPayToTeachers.toLocaleString()}<span className="text-xs font-normal opacity-90">원</span>
                    </div>
                    <span className="text-[10px] opacity-80">선생님 통장 실제 이체 합계</span>
                  </div>

                  {/* Card 5: Withholding Tax 3.3% (For Tax Filing) */}
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
                    <span className="text-[11px] font-bold text-amber-900 block">🏛️ 3.3% 원천징수 세액</span>
                    <div className="text-lg sm:text-xl font-black text-amber-700 mt-1 truncate">
                      {settlementSummary.totalTaxDeducted.toLocaleString()}<span className="text-xs font-normal text-amber-600">원</span>
                    </div>
                    <span className="text-[10px] text-amber-800">소득세 3% + 지방세 0.3%</span>
                  </div>
                </div>

                {/* Google Sheets Copy Guide Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs text-emerald-950">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                      📊
                    </div>
                    <div>
                      <div className="font-extrabold text-sm">구글 스프레드시트 1초 복사 기능 안내</div>
                      <div className="text-[11px] text-emerald-800 mt-0.5">
                        상단의 <strong>[📋 구글 시트 복사]</strong> 버튼을 누른 후, 구글 스프레드시트나 엑셀의 빈 셀(A1)에 <code>Ctrl+V</code>(또는 <code>Cmd+V</code>)를 누르면 모든 열과 세금 계산이 칸별로 자동 정렬되어 붙여넣어집니다.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyForGoogleSheets}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold whitespace-nowrap shadow-xs shrink-0"
                  >
                    지금 복사하기 →
                  </button>
                </div>

                {/* Teachers Detailed Settlement Table */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900">선생님별 3.3% 세무 및 정산 송금 내역표</h3>
                    <span className="text-xs text-slate-500">단위: 원 (KRW)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">선생님 성함</th>
                          <th className="py-3 px-4">과목</th>
                          <th className="py-3 px-4">정산 입금 계좌</th>
                          <th className="py-3 px-4 text-center">수업횟수</th>
                          <th className="py-3 px-4 text-right">3.3% 떼기 전 (세전)</th>
                          <th className="py-3 px-4 text-right">3.3% 세금 (원천징수)</th>
                          <th className="py-3 px-4 text-right bg-emerald-50/70 text-emerald-900 font-black">
                            실제 보낼 돈 (3.3% 뗀 후)
                          </th>
                          <th className="py-3 px-4 text-right">원장님 순수익</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {settlementSummary.teacherBreakdown.map(item => (
                          <tr key={item.teacher.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{item.teacher.name}</td>
                            <td className="py-3.5 px-4 text-slate-600">{item.teacher.subject}</td>
                            <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                              {item.teacher.bankAccount || (
                                <span className="text-slate-400 italic">계좌 미등록</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                              {item.sessionCount}회
                            </td>
                            <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                              {item.grossPay.toLocaleString()}원
                            </td>
                            <td className="py-3.5 px-4 text-right text-amber-700 font-semibold">
                              -{item.totalTax.toLocaleString()}원
                              <span className="block text-[10px] text-slate-400 font-normal">
                                (소득 {item.incomeTax} + 지방 {item.localTax})
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 text-sm bg-emerald-50/50">
                              {item.netPay.toLocaleString()}원
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-brand-700">
                              {item.directorEarned.toLocaleString()}원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                        <tr>
                          <td colSpan="3" className="py-3.5 px-4 text-slate-900 font-extrabold">합계 (총 {teachers.length}명)</td>
                          <td className="py-3.5 px-4 text-center text-slate-900 font-black">
                            {settlementSummary.totalSessions}회
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-800">
                            {settlementSummary.totalGrossPay.toLocaleString()}원
                          </td>
                          <td className="py-3.5 px-4 text-right text-amber-800 font-bold">
                            -{settlementSummary.totalTaxDeducted.toLocaleString()}원
                          </td>
                          <td className="py-3.5 px-4 text-right text-emerald-800 font-black text-sm bg-emerald-100/60">
                            {settlementSummary.totalNetPayToTeachers.toLocaleString()}원
                          </td>
                          <td className="py-3.5 px-4 text-right text-brand-800 font-black">
                            {settlementSummary.totalDirectorShare.toLocaleString()}원
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TEACHER VIEWS                                                             */}
        {/* ========================================================================= */}
        {currentRole === "teacher" && (
          <div className="space-y-4">
            {/* Teacher Greeting */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-black">{currentTeacher?.name} 포털</h1>
                <p className="text-white/80 text-xs mt-0.5">{currentTeacher?.subject} • 담당 학생 출석 체크 및 일지 작성</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-2.5 px-3 self-start sm:self-auto text-xs">
                <span>{settlementMonth} 예상 정산금: </span>
                <strong className="text-amber-300 text-sm">
                  {(settlementSummary.teacherBreakdown.find(t => t.teacher.id === currentTeacherId)?.teacherEarned || 0).toLocaleString()}원
                </strong>
              </div>
            </div>

            {/* TEACHER TAB 1: My Students & Attendance */}
            {activeTab === "my_students" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80">
                  <h2 className="text-base font-bold text-slate-900">내 담당 학생 출석 체크</h2>
                  <button
                    onClick={() => {
                      setTargetTeacherForNewStudent(currentTeacherId);
                      setEditingStudent({
                        id: "s_" + Date.now(),
                        teacherId: currentTeacherId,
                        name: "",
                        phone: "",
                        school: "",
                        parentPhone: "",
                        notes: "",
                        totalSessions: 0,
                        registeredAt: getFormattedNow().dateString
                      });
                      setIsStudentModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
                  >
                    + 학생 추가
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.filter(s => !s.isDeleted && s.teacherId === currentTeacherId).map(student => {
                    // Check if student checked in today and lesson log is still waiting to be filled
                    const todayStr = getFormattedNow().dateString;
                    const todayAtt = attendances.find(a => a.studentId === student.id && a.date === todayStr && a.status === "present");
                    const isWaitingForLog = todayAtt && (todayAtt.needsLog || !todayAtt.lessonLog || !todayAtt.lessonLog.lessonPoints?.some(p => p.trim()));

                    return (
                      <div
                        key={student.id}
                        className={`rounded-3xl p-4 sm:p-5 space-y-3.5 transition-all duration-300 ${
                          isWaitingForLog
                            ? "bg-slate-950 text-white border-2 border-brand-500 shadow-2xl ring-4 ring-brand-500/30 transform scale-[1.01]"
                            : "bg-white text-slate-800 border border-slate-200/80 shadow-xs"
                        }`}
                      >
                        {/* Attendance Highlighting Badge (Disappears once lesson log is filled!) */}
                        {isWaitingForLog && (
                          <div className="p-2.5 bg-gradient-to-r from-amber-500 to-brand-600 text-white rounded-2xl flex items-center justify-between text-xs animate-pulse">
                            <span className="font-black flex items-center space-x-1.5">
                              <span>⚡</span>
                              <span>방금 등원 완료! 수업 일지 작성 대기 중</span>
                            </span>
                            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                              {todayAtt.timestamp?.split(" ").slice(-1)[0]}
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-black text-base ${isWaitingForLog ? "text-white" : "text-slate-900"}`}>{student.name}</h3>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${isWaitingForLog ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700"}`}>
                                {student.totalSessions || 0}회차
                              </span>
                              {student.checkinCode && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold">
                                  코드: {student.checkinCode}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${isWaitingForLog ? "text-slate-300" : "text-slate-500"}`}>
                              {student.school} • 수강료: {((student.sessionPrice || 45000)).toLocaleString()}원
                            </p>
                          </div>
                        </div>

                      {student.notes && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl italic">
                          메모: {student.notes}
                        </div>
                      )}

                      {/* Attendance Buttons */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">출결 체크</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => handleMarkPresent(student)}
                            className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                          >
                            ✓ 출석
                          </button>
                          <button
                            onClick={() => handleMarkAbsentDeducted(student)}
                            className="py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[11px] font-bold"
                          >
                            ✕ 결석(차감)
                          </button>
                          <button
                            onClick={() => handleOpenExcuseModal(student)}
                            className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                          >
                            ✎ 사유결석
                          </button>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <button
                          onClick={() => openShareModal("parent", student)}
                          className={`px-2 py-1 font-bold rounded-lg border flex items-center space-x-1 ${
                            isWaitingForLog ? "bg-white/10 text-white border-white/20" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          <span>💌 알림장 전송</span>
                        </button>
                        <button
                          onClick={() => handleOpenReportModal(student)}
                          className={`font-bold hover:underline ${isWaitingForLog ? "text-brand-400" : "text-brand-600"}`}
                        >
                          4회차 리포트 →
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEACHER TAB 2: Attendance Logs */}
            {activeTab === "my_attendance" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <h2 className="text-base font-bold text-slate-900">내 수업 일지 및 과제 기록</h2>
                  <p className="text-xs text-slate-500">매 수업마다 작성된 3가지 레슨 포인트와 과제입니다.</p>
                </div>

                <div className="space-y-3">
                  {attendances.filter(a => a.teacherId === currentTeacherId && a.status === "present").map(att => {
                    const st = students.find(s => s.id === att.studentId);
                    return (
                      <div key={att.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="font-bold text-sm text-slate-900">
                            {st?.name} ({att.timestamp})
                          </div>
                          <button
                            onClick={() => {
                              setAttendanceTargetStudent({ student: st, record: att });
                              setIsAttendanceModalOpen(true);
                            }}
                            className="text-xs font-bold text-brand-600 hover:underline"
                          >
                            일지/과제 수정
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="font-bold text-brand-800 block mb-1">수업 내용 3가지</span>
                            <ol className="list-decimal list-inside space-y-1 text-slate-700">
                              {att.lessonLog?.lessonPoints?.map((p, idx) => (
                                <li key={idx}>{p || "(미작성)"}</li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="font-bold text-emerald-800 block mb-1">과제 3가지</span>
                            <ol className="list-decimal list-inside space-y-1 text-slate-700">
                              {att.lessonLog?.homeworkPoints?.map((p, idx) => (
                                <li key={idx}>{p || "(미작성)"}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEACHER TAB 3: Reports */}
            {activeTab === "my_reports" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80">
                  <h2 className="text-base font-bold text-slate-900">4회차 성장 리포트 & iCloud 영상</h2>
                  <button
                    onClick={() => {
                      const myStudents = students.filter(s => s.teacherId === currentTeacherId);
                      if (myStudents.length > 0) handleOpenReportModal(myStudents[0]);
                    }}
                    className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
                  >
                    + 새 리포트 작성
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthReports.filter(r => r.teacherId === currentTeacherId).map(rep => {
                    const st = students.find(s => s.id === rep.studentId);
                    return (
                      <div key={rep.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {rep.sessionCycle}회차 리포트
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 mt-1">{rep.title}</h3>
                            <p className="text-xs text-slate-500">학생: {st?.name}</p>
                          </div>
                          <button
                            onClick={() => handleOpenReportModal(st, rep)}
                            className="text-xs font-bold text-brand-600"
                          >
                            수정
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl whitespace-pre-line">
                          {rep.growthSummary}
                        </p>
                        {rep.icloudVideoUrl && (
                          <div className="text-xs text-blue-600 font-bold truncate">
                            🎬 {rep.icloudVideoUrl}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEACHER TAB 4: Settlement with 3.3% Breakdown */}
            {activeTab === "my_settlement" && (() => {
              const myData = settlementSummary.teacherBreakdown.find(t => t.teacher.id === currentTeacherId) || {
                sessionCount: 0, grossPay: 0, totalTax: 0, netPay: 0
              };
              return (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80">
                    <h2 className="text-base font-extrabold text-slate-900">{currentTeacher?.name} 님의 {settlementMonth} 정산 명세서</h2>
                    <p className="text-xs text-slate-500 mt-0.5">수업 회당 22,500원 배분 • 3.3% 사업소득세 원천징수 내역</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                      <span className="text-xs text-slate-500 font-bold block">3.3% 떼기 전 (세전 금액)</span>
                      <div className="text-xl font-black text-slate-800 mt-1">
                        {myData.grossPay.toLocaleString()}원
                      </div>
                      <span className="text-[10px] text-slate-400">{myData.sessionCount}회 × 22,500원</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30">
                      <span className="text-xs text-amber-900 font-bold block">3.3% 원천징수 세금</span>
                      <div className="text-xl font-black text-amber-700 mt-1">
                        -{myData.totalTax.toLocaleString()}원
                      </div>
                      <span className="text-[10px] text-amber-800">소득세 3% + 지방소득세 0.3%</span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xs">
                      <span className="text-xs font-semibold opacity-90 block">실제 통장 입금액 (실지급액)</span>
                      <div className="text-2xl font-black mt-1">
                        {myData.netPay.toLocaleString()}원
                      </div>
                      <span className="text-[10px] opacity-80">3.3% 공제 후 정산 송금액</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600">
                    <strong>입금 예정 계좌:</strong> {currentTeacher?.bankAccount || "계좌 미등록 (원장님께 등록 요청)"}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARENT VIEWS                                                              */}
        {/* ========================================================================= */}
        {currentRole === "parent" && (
          <div className="space-y-4">
            {/* Parent Welcoming Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 sm:p-7 text-white shadow-md">
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                ✨ {currentStudent?.name} 학생 학부모 알림장
              </span>
              <h1 className="text-xl sm:text-2xl font-black mt-2">
                {currentStudent?.name}의 음악 성장 일기
              </h1>
              <p className="text-xs text-white/80 mt-1">
                학교: {currentStudent?.school} • 지도: {teachers.find(t => t.id === currentStudent?.teacherId)?.name}
              </p>
            </div>

            {/* PARENT TAB 1: Overview */}
            {activeTab === "parent_overview" && (
              <div className="space-y-4">
                {/* Latest Attendance */}
                {(() => {
                  const myAtt = attendances.filter(a => a.studentId === currentStudent?.id);
                  const latest = myAtt[0];
                  return (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block">최근 출석 현황</span>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                          {latest ? latest.timestamp : "출석 기록 없음"}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        출석 완료
                      </span>
                    </div>
                  );
                })()}

                {/* Latest Lesson & Homework */}
                {(() => {
                  const latestLesson = attendances.find(a => a.studentId === currentStudent?.id && a.lessonLog);
                  return latestLesson?.lessonLog ? (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                      <h2 className="font-bold text-sm sm:text-base text-slate-900">오늘 수업 내용 & 과제</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <strong className="text-brand-800 block mb-1.5">📖 배운 핵심 내용 3가지</strong>
                          <ul className="space-y-1.5 text-slate-700">
                            {latestLesson.lessonLog.lessonPoints?.map((p, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="font-bold text-brand-600">{idx + 1}.</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <strong className="text-emerald-800 block mb-1.5">✍️ 이번 주 과제 3가지</strong>
                          <ul className="space-y-1.5 text-slate-700">
                            {latestLesson.lessonLog.homeworkPoints?.map((p, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="font-bold text-emerald-600">{idx + 1}.</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Latest 4-session Report & iCloud Video */}
                {(() => {
                  const rep = growthReports.find(r => r.studentId === currentStudent?.id);
                  return rep ? (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {rep.sessionCycle}회차 정기 성장 리포트
                        </span>
                        <span className="text-xs text-slate-400">{rep.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{rep.title}</h3>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl whitespace-pre-line leading-relaxed">
                        {rep.growthSummary}
                      </p>

                      {rep.icloudVideoUrl && (
                        <a
                          href={rep.icloudVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm"
                        >
                          <Icons.VideoCamera />
                          <span>iCloud 연주 영상 보러가기 🎬</span>
                        </a>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* PARENT TAB 2: Attendance History */}
            {activeTab === "parent_attendance" && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h2 className="font-bold text-base text-slate-900">전체 출석 현황</h2>
                <div className="divide-y divide-slate-100">
                  {attendances.filter(a => a.studentId === currentStudent?.id).map(att => (
                    <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{att.timestamp}</div>
                        <div className="text-[11px] text-slate-400">{att.sessionNumber || "N"}회차 수업</div>
                      </div>
                      <span className="font-bold text-emerald-700">✓ 출석</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PARENT TAB 3: Lesson Logs */}
            {activeTab === "parent_log" && (
              <div className="space-y-3">
                {attendances.filter(a => a.studentId === currentStudent?.id && a.lessonLog).map(att => (
                  <div key={att.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
                    <div className="font-bold text-sm text-slate-900 border-b pb-2">
                      {att.timestamp} ({att.sessionNumber}회차)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <strong className="text-brand-800 block mb-1">수업 내용</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {att.lessonLog.lessonPoints?.map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <strong className="text-emerald-800 block mb-1">연습 과제</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {att.lessonLog.homeworkPoints?.map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PARENT TAB 4: Reports */}
            {activeTab === "parent_report" && (
              <div className="space-y-4">
                {growthReports.filter(r => r.studentId === currentStudent?.id).map(rep => (
                  <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                      {rep.sessionCycle}회차 정기 성장 리포트
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{rep.title}</h3>
                    <p className="bg-slate-50 p-3 rounded-xl whitespace-pre-line leading-relaxed">{rep.growthSummary}</p>
                    {rep.icloudVideoUrl && (
                      <a
                        href={rep.icloudVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center space-x-1"
                      >
                        <Icons.VideoCamera />
                        <span>iCloud 연주 영상 감상 ↗</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (스마트폰 최적화 하단 탭바)                   */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-2 flex justify-around items-center text-[10px] font-medium shadow-lg no-print">
        {currentRole === "admin" && isAdminLoggedIn && (
          <>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "teachers" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.UserGroup />
              <span className="mt-0.5">선생님/학생</span>
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "attendance" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Clock />
              <span className="mt-0.5">출석/일지</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "reports" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Sparkles />
              <span className="mt-0.5">성장리포트</span>
            </button>
            <button
              onClick={() => setActiveTab("settlement")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "settlement" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Calculator />
              <span className="mt-0.5">정산</span>
            </button>
          </>
        )}

        {currentRole === "teacher" && (
          <>
            <button
              onClick={() => setActiveTab("my_students")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "my_students" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.UserGroup />
              <span className="mt-0.5">내 학생</span>
            </button>
            <button
              onClick={() => setActiveTab("my_attendance")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "my_attendance" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.BookOpen />
              <span className="mt-0.5">수업일지</span>
            </button>
            <button
              onClick={() => setActiveTab("my_reports")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "my_reports" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Sparkles />
              <span className="mt-0.5">성장리포트</span>
            </button>
            <button
              onClick={() => setActiveTab("my_settlement")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "my_settlement" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Calculator />
              <span className="mt-0.5">내 정산</span>
            </button>
          </>
        )}

        {currentRole === "parent" && (
          <>
            <button
              onClick={() => setActiveTab("parent_overview")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "parent_overview" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Academic />
              <span className="mt-0.5">홈</span>
            </button>
            <button
              onClick={() => setActiveTab("parent_attendance")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "parent_attendance" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Clock />
              <span className="mt-0.5">출석이력</span>
            </button>
            <button
              onClick={() => setActiveTab("parent_log")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "parent_log" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.BookOpen />
              <span className="mt-0.5">수업/과제</span>
            </button>
            <button
              onClick={() => setActiveTab("parent_report")}
              className={`flex flex-col items-center py-1 px-2 ${activeTab === "parent_report" ? "text-brand-600 font-bold" : "text-slate-500"}`}
            >
              <Icons.Sparkles />
              <span className="mt-0.5">영상/리포트</span>
            </button>
          </>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* MODAL: Mobile Connection Guide Modal                                      */}
      {/* ========================================================================= */}
      {isMobileGuideOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-brand-700 font-bold">
                <Icons.DeviceMobile />
                <span>스마트폰에서 접속하기</span>
              </div>
              <button onClick={() => setIsMobileGuideOpen(false)} className="text-slate-400 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
                <strong>🌍 어디서나 접속 가능한 공개 인터넷 링크:</strong><br />
                와이파이 상관없이 LTE / 5G / 집 / 학원 어디서나 스마트폰으로 즉시 접속하실 수 있습니다.
              </div>

              <div>
                <span className="font-bold block mb-1">스마트폰 브라우저 주소창에 입력 (링크 터치 시 복사):</span>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(getShareUrl());
                    alert("공개 주소가 클립보드에 복사되었습니다!");
                  }}
                  className="p-3 bg-brand-50 rounded-xl font-mono text-xs font-bold text-center text-brand-700 select-all border border-brand-200 cursor-pointer hover:bg-brand-100"
                >
                  {getShareUrl()}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center">터치하면 주소가 복사됩니다.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <strong className="block text-slate-800">💡 앱처럼 홈 화면에 추가하기:</strong>
                <p>• <strong>아이폰(Safari)</strong>: 하단 공유 버튼(↑) → [홈 화면에 추가]</p>
                <p>• <strong>갤럭시(Chrome)</strong>: 메뉴(⋮) → [홈 화면에 추가] 또는 [앱 설치]</p>
              </div>

              <button
                onClick={() => setIsMobileGuideOpen(false)}
                className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

            {/* ========================================================================= */}
      {/* MODAL: KakaoTalk / Message Share Modal                                    */}
      {/* ========================================================================= */}
      {shareModalData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <span>{shareModalData.type === "parent" ? "💌" : "🔗"}</span>
                <span>{shareModalData.title}</span>
              </div>
              <button onClick={() => setShareModalData(null)} className="text-slate-400 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200">
                <strong>🔒 1:1 비공개 전용 접속 안내:</strong><br />
                이 링크로 접속한 사람은 <strong>오직 본인의 정보만 볼 수 있으며</strong>, 다른 사람의 데이터나 원장님 정산 화면은 자동으로 완벽 차단됩니다!
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">카카오톡 / 문자 전송 문구 미리보기:</label>
                <textarea
                  readOnly
                  rows="7"
                  value={shareModalData.message}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed text-slate-800 select-all focus:outline-none"
                ></textarea>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareModalData.message);
                    alert("카카오톡 안내 문구와 링크가 모두 복사되었습니다! 카카오톡 대화창에 바로 [붙여넣기] 하세요.");
                    setShareModalData(null);
                  }}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <span>💬 카카오톡 메시지 전체 복사하기</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareModalData.link);
                    alert("전용 링크 주소만 복사되었습니다!");
                    setShareModalData(null);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  🔗 링크 주소만 복사하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* ========================================================================= */}
      {/* FULLSCREEN KIOSK VIEW: Tablet Entrance Attendance (6-Digit Auto Check-in)  */}
      {/* ========================================================================= */}
      {isKioskMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white z-50 flex flex-col justify-between p-6 sm:p-10 select-none">
          {/* Kiosk Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <Icons.Academic />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">트리니티 음악학원</h1>
                <p className="text-xs text-brand-300 font-bold">스마트 출결 키오스크</p>
              </div>
            </div>

            <button
              onClick={() => setIsKioskMode(false)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl text-xs font-semibold"
            >
              키오스크 종료 ✕
            </button>
          </div>

          {/* Center Check-in Pad Area */}
          <div className="max-w-md w-full mx-auto my-auto text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block mb-1">
                ATTENDANCE CHECK-IN
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                출결 번호 6자리를 입력해주세요
              </h2>
              <p className="text-xs text-slate-400 mt-1">부여받은 6자리 학생 코드를 누르면 자동으로 출석이 완료됩니다.</p>
            </div>

            {/* Success Overlay Modal */}
            {kioskSuccessStudent ? (
              <div className="p-8 bg-emerald-600/90 backdrop-blur-md rounded-3xl border-2 border-emerald-400 shadow-2xl space-y-3 transform scale-105 transition-all">
                <div className="text-5xl animate-bounce">🎉</div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {kioskSuccessStudent.name} 학생, 출석 완료!
                </h3>
                <p className="text-sm text-emerald-100">
                  누적 {kioskSuccessStudent.totalSessions || 1}회차 레슨입니다. 오늘도 즐겁게 연주해봐요! 🎹
                </p>
                <div className="text-xs text-emerald-200 pt-2 font-mono">
                  {getFormattedNow().timestampString}
                </div>
              </div>
            ) : (
              <>
                {/* 6 Digit Display Indicator */}
                <div className="flex justify-center items-center space-x-3 py-3">
                  {[0, 1, 2, 3, 4, 5].map(idx => {
                    const digit = kioskCode[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black font-mono transition-all ${
                          digit
                            ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 border-2 border-brand-400"
                            : "bg-white/10 text-white/20 border-2 border-white/10"
                        }`}
                      >
                        {digit ? digit : "•"}
                      </div>
                    );
                  })}
                </div>

                {/* Error Message */}
                {kioskErrorMessage && (
                  <div className="text-xs font-bold text-red-400 bg-red-900/40 p-2.5 rounded-xl border border-red-500/30 animate-pulse">
                    ⚠️ {kioskErrorMessage}
                  </div>
                )}

                {/* 3x4 Touch Keypad */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-sm mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (kioskCode.length < 6) {
                          const next = kioskCode + String(num);
                          setKioskCode(next);
                          if (next.length === 6) {
                            handleKioskCheckin(next);
                          }
                        }
                      }}
                      className="h-16 sm:h-18 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-brand-600 text-2xl font-black text-white shadow-sm border border-white/10 transition-all flex items-center justify-center active:scale-95"
                    >
                      {num}
                    </button>
                  ))}

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setKioskCode("");
                      setKioskErrorMessage("");
                    }}
                    className="h-16 sm:h-18 rounded-2xl bg-white/5 hover:bg-white/15 text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center active:scale-95"
                  >
                    전체 지우기
                  </button>

                  {/* Zero Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (kioskCode.length < 6) {
                        const next = kioskCode + "0";
                        setKioskCode(next);
                        if (next.length === 6) {
                          handleKioskCheckin(next);
                        }
                      }
                    }}
                    className="h-16 sm:h-18 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-brand-600 text-2xl font-black text-white shadow-sm border border-white/10 transition-all flex items-center justify-center active:scale-95"
                  >
                    0
                  </button>

                  {/* Backspace Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setKioskCode(prev => prev.slice(0, -1));
                      setKioskErrorMessage("");
                    }}
                    className="h-16 sm:h-18 rounded-2xl bg-white/5 hover:bg-white/15 text-xl font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center active:scale-95"
                  >
                    ⌫
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Kiosk Footer Info */}
          <div className="text-center text-xs text-slate-500">
            트리니티 음악학원 스마트 출결 시스템 • 키보드 숫자 입력도 지원합니다.
          </div>
        </div>
      )}

      {/* Common Modals (Teacher, Student, Attendance, Excuse, Report) */}
      {isTeacherModalOpen && editingTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">선생님 정보 등록/수정</h3>
              <button onClick={() => setIsTeacherModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setTeachers(prev => {
                const ex = prev.some(t => t.id === editingTeacher.id);
                return ex ? prev.map(t => t.id === editingTeacher.id ? editingTeacher : t) : [...prev, editingTeacher];
              });
              setIsTeacherModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">선생님 이름 *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">과목</label>
                <input
                  type="text"
                  value={editingTeacher.subject}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">연락처</label>
                <input
                  type="tel"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">정산 입금 계좌번호 (은행명, 계좌, 예금주) *</label>
                <input
                  type="text"
                  placeholder="예: 카카오뱅크 3333-12-3456789 (예금주: 홍길동)"
                  value={editingTeacher.bankAccount || ""}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, bankAccount: e.target.value })}
                  className="w-full p-2 border rounded-xl font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">월말 정산 시 이 계좌로 실제 송금액이 표시됩니다.</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsTeacherModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-xl">취소</button>
                <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStudentModalOpen && editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">학생 정보 등록/수정</h3>
              <button onClick={() => setIsStudentModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setStudents(prev => {
                const ex = prev.some(s => s.id === editingStudent.id);
                return ex ? prev.map(s => s.id === editingStudent.id ? editingStudent : s) : [...prev, editingStudent];
              });
              setIsStudentModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">담당 선생님 *</label>
                <select
                  value={editingStudent.teacherId}
                  onChange={(e) => setEditingStudent({ ...editingStudent, teacherId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">학생 이름 *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">학생 연락처</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">학교</label>
                  <input
                    type="text"
                    value={editingStudent.school}
                    onChange={(e) => setEditingStudent({ ...editingStudent, school: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">학부모 번호 *</label>
                <input
                  type="tel"
                  required
                  value={editingStudent.parentPhone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              {/* 6-Digit Auto Check-in Code */}
              <div className="p-3 bg-brand-50/60 border border-brand-100 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-brand-900 text-xs">아이 출결 고유 코드 (숫자 6자리) *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = String(Math.floor(100000 + Math.random() * 900000));
                      setEditingStudent({ ...editingStudent, checkinCode: newCode });
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    🎲 번호 새로고침
                  </button>
                </div>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="예: 102458"
                  value={editingStudent.checkinCode || ""}
                  onChange={(e) => setEditingStudent({ ...editingStudent, checkinCode: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full p-2.5 border border-brand-200 rounded-xl font-mono text-center text-sm font-extrabold tracking-widest bg-white"
                />
                <span className="text-[10px] text-slate-500 block">
                  입구 태블릿에 이 6자리 번호를 입력하면 자동으로 출석이 체크됩니다.
                </span>
              </div>

              {/* Custom Tuition & Revenue Share Settings per Student/Instrument */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 text-xs">악기/학생별 1회 수강료 및 정산 배분 설정 *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const p = editingStudent.sessionPrice || 45000;
                      const half = Math.floor(p / 2);
                      setEditingStudent({ ...editingStudent, teacherShare: half, directorShare: p - half });
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    ⚖️ 5:5 비율 계산
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">1회 수강료 (원)</label>
                    <input
                      type="number"
                      step="1000"
                      value={editingStudent.sessionPrice || 45000}
                      onChange={(e) => {
                        const price = parseInt(e.target.value) || 0;
                        const half = Math.floor(price / 2);
                        setEditingStudent({ ...editingStudent, sessionPrice: price, teacherShare: half, directorShare: price - half });
                      }}
                      className="w-full p-2 border rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">선생님 몫 (원)</label>
                    <input
                      type="number"
                      step="500"
                      value={editingStudent.teacherShare !== undefined ? editingStudent.teacherShare : 22500}
                      onChange={(e) => setEditingStudent({ ...editingStudent, teacherShare: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded-xl font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">원장님 몫 (원)</label>
                    <input
                      type="number"
                      step="500"
                      value={editingStudent.directorShare !== undefined ? editingStudent.directorShare : 22500}
                      onChange={(e) => setEditingStudent({ ...editingStudent, directorShare: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded-xl font-bold text-brand-700"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  * 학생/악기마다 수강료가 달라도 정산 대시보드에서 각 단가대로 정확하게 합산됩니다.
                </span>
              </div>
              <div>
                <label className="font-bold block mb-1">특이사항 (메모)</label>
                <textarea
                  rows="2"
                  value={editingStudent.notes}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-xl">취소</button>
                <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAttendanceModalOpen && attendanceTargetStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between border-b pb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {attendanceTargetStudent.student.name} 학생 수업 일지 & 과제
                </h3>
                <p className="text-[11px] text-slate-500">{attendanceTargetStudent.record.timestamp}</p>
              </div>
              <button onClick={() => setIsAttendanceModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setAttendances(prev => prev.map(a => a.id === attendanceTargetStudent.record.id ? attendanceTargetStudent.record : a));
              setIsAttendanceModalOpen(false);
            }} className="space-y-4 text-xs">
              <div className="bg-brand-50/50 p-3 rounded-2xl space-y-2 border border-brand-100">
                <strong className="text-brand-900 block">오늘 수업 내용 3가지</strong>
                {[0, 1, 2].map(idx => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`수업 내용 ${idx + 1}`}
                    value={attendanceTargetStudent.record.lessonLog?.lessonPoints?.[idx] || ""}
                    onChange={(e) => {
                      const pts = [...(attendanceTargetStudent.record.lessonLog?.lessonPoints || ["", "", ""])];
                      pts[idx] = e.target.value;
                      setAttendanceTargetStudent({
                        ...attendanceTargetStudent,
                        record: { ...attendanceTargetStudent.record, lessonLog: { ...attendanceTargetStudent.record.lessonLog, lessonPoints: pts } }
                      });
                    }}
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                ))}
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-2xl space-y-2 border border-emerald-100">
                <strong className="text-emerald-900 block">그날의 과제 3가지</strong>
                {[0, 1, 2].map(idx => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`과제 ${idx + 1}`}
                    value={attendanceTargetStudent.record.lessonLog?.homeworkPoints?.[idx] || ""}
                    onChange={(e) => {
                      const hw = [...(attendanceTargetStudent.record.lessonLog?.homeworkPoints || ["", "", ""])];
                      hw[idx] = e.target.value;
                      setAttendanceTargetStudent({
                        ...attendanceTargetStudent,
                        record: { ...attendanceTargetStudent.record, lessonLog: { ...attendanceTargetStudent.record.lessonLog, homeworkPoints: hw } }
                      });
                    }}
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                ))}
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAttendanceModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-xl">닫기</button>
                <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isExcuseModalOpen && excuseTargetStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900">{excuseTargetStudent.name} 사유 결석</h3>
            <textarea
              rows="3"
              placeholder="결석 사유 입력 (예: 학교 행사로 사전 연락)"
              value={excuseReasonInput}
              onChange={(e) => setExcuseReasonInput(e.target.value)}
              className="w-full p-2 border rounded-xl text-xs"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button onClick={() => setIsExcuseModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs">취소</button>
              <button onClick={handleSaveExcuse} className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold">저장</button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && reportTargetStudent && editingReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">{reportTargetStudent.name} 성장 리포트</h3>
              <button onClick={() => setIsReportModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveReport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">리포트 제목 *</label>
                <input
                  type="text"
                  required
                  value={editingReport.title}
                  onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">지난 4주간 성장 내용 *</label>
                <textarea
                  rows="3"
                  required
                  value={editingReport.growthSummary}
                  onChange={(e) => setEditingReport({ ...editingReport, growthSummary: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                ></textarea>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5">
                <label className="font-bold block text-blue-900">iCloud 연주 영상 공유 링크 *</label>
                <input
                  type="url"
                  placeholder="https://share.icloud.com/photos/..."
                  value={editingReport.icloudVideoUrl}
                  onChange={(e) => setEditingReport({ ...editingReport, icloudVideoUrl: e.target.value })}
                  className="w-full p-2 border border-blue-300 rounded-xl bg-white font-mono text-[11px]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-xl">취소</button>
                <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
