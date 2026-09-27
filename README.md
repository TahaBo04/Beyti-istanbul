# Beyti Istanbul — planning d'équipe

A small mobile-friendly site for Nouhayla, Kaoutar and Abderahim. After signing in, each team member sees **their own** shift for today in the `Africa/Casablanca` timezone and their Monday–Sunday schedule. The updated Saturday/Sunday rotation is in `schedule.mjs`.

## Setup needed before anyone can log in

1. Create a dedicated Supabase project. In Auth settings, disable public self-signup. Do not reuse a project belonging to another application without checking its security configuration.
2. Run `setup.sql` in the project's SQL editor. Under Authentication → Users, invite or create the three people using their own real email addresses. Send passwords/invitations privately; never commit them.
3. Copy each user's UUID from Authentication → Users into the matching `insert` statement at the bottom of `setup.sql` and run those three statements. `team_profiles` has row-level security: each signed-in user can read only their own profile; visitors cannot read it. Check that each UUID maps to the correct person.
4. Edit `config.mjs` with the project's URL and **publishable** key. These two values are intended for browser use. Never paste a service-role/secret key or a password into the repository.
5. Host this repository as a static site (for example GitHub Settings → Pages → Deploy from a branch → `main` / root). The repository itself does not automatically publish on creating files. Add the hosted URL to Supabase Auth → URL Configuration, including the allowed redirect URL if using email invitations/recovery.
6. Test each person's sign-in and today's card, plus a wrong password, a signed-in account with no profile, and the mobile layout.

Run locally from the repo folder with `python3 -m http.server 8000` and open `http://localhost:8000`. No build step. Automated schedule checks: `node --test tests/schedule.test.mjs`.

The schedule data is committed as public source code because this is a public repository; sign-in personalizes the view but does **not** make the underlying weekly shifts private. To make shifts confidential, store them in the database with per-user RLS and remove them from `schedule.mjs`.

“Fin de service” deliberately has no fixed end time because one was not supplied.
