# Trinity Academy

A static React application for academy administration, attendance, lesson notes,
growth reports, tuition settings, and teacher settlement. All operational data
is read from Supabase after authentication; the public source contains no sample
student or staff records.

## Configure Supabase

1. Create a Supabase project and run `supabase_schema.sql` in its SQL editor.
2. In **Authentication → Providers**, enable email/password sign-in and keep
   public sign-ups disabled. Create teacher invitations from the Supabase Auth
   dashboard or a trusted administrator workflow.
3. Add academy records using the Supabase dashboard. Create each user's
   `public.profiles` row from the SQL editor, assigning `admin`, `teacher`, or
   `parent` and the matching `teacher_id` or `student_id` where applicable.
   Profile changes are intentionally not available to browser users.
4. Copy `supabase-config.example.js` to `supabase-config.js` and fill in the
   Supabase project URL and publishable/anon key. This key is designed to be
   public; never put a service-role key in the browser. `supabase-config.js` is
   ignored by Git.
5. Add the deployed site URL to Supabase Auth's allowed redirect URLs.

RLS policies in the schema deny anonymous access. Administrators can manage
academy records; teachers are scoped to their assigned teacher ID; parents are
scoped to their linked student ID. Teacher payout account details are stored in
a separate table that parents cannot read. The seven-day client session limit
is a convenience only; Supabase Auth token expiry and RLS enforce access.

Teacher registration is invitation-only. In **Authentication → Users**, an
administrator invites the teacher's email, then uses a trusted admin workflow
to link the resulting Auth user UUID to the teacher record (the reported live
schema has `teachers.auth_user_id`) and provision the matching profile under
the existing schema and RLS rules. Complete that linkage before the teacher
opens the email invite. The invite link opens a password setup screen; the
browser updates only the invited user's password and never creates an Auth
user, teacher row, profile, or role. Accounts without a valid profile remain
blocked from academy data.

The app's current profile/data mapping expects `profiles.role`,
`profiles.teacher_id`, and `profiles.student_id`, plus a
`teacher_payment_details` table with `teacher_id` and `bank_account`. The
reported existing project instead has additional `teachers.auth_user_id`,
different role/helper names, and a `teacher_payment_details` ledger shape.
These schemas have not been reconciled, so this frontend is not yet compatible
with the reported live project for production use. Review and approve a
migration and client mapping before connecting this app or inviting real
teachers; do not run this repository's schema over an existing database or
weaken its RLS policies.

## Run locally

After creating `supabase-config.js`, run:

```sh
./start.sh
```

The local server binds to `127.0.0.1` and only serves static files. It does not
provide a data API or write local JSON records.

## GitHub Pages

`index.html` is the Pages entry point and uses relative asset/config paths for a
repository site. Pages requires `supabase-config.js` to be present in the
published artifact. Supply it through the deployment process or add the public
Supabase URL and publishable key after a project is provisioned. Do not publish
real data, a service-role key, or a Git history containing previously committed
personal data or credentials. Create a clean code-only snapshot for public
publication rather than pushing the source repository's old history.
