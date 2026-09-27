# Beyti Istanbul — planning d’équipe

Mobile-friendly Vercel site for three accounts: `nouhayla`, `kaoutar`, `abderahim`. After logging in, each person sees their own shift for the current day in Casablanca and their week. Saturday and Sunday use the revised rotation.

## Deploy

1. Import `TahaBo04/Beyti-istanbul` as a new Vercel project. Use the repository root and the **Other** framework preset. The `api/*.mjs` files run as Node.js functions; no external database or build command is needed.
2. Generate passwords and hashes on a trusted machine using `node scripts/generate-accounts.mjs`. Do not paste its complete output into chat, issues or a Git commit. Give each person only their own password by a private channel.
3. In Vercel project Settings → Environment Variables, add `BEYTI_USERS` (the generated JSON string with three salted scrypt hashes) and `BEYTI_SESSION_SECRET` (generated random value). Apply to Production. These values must remain private Vercel environment variables. Redeploy after adding them.
4. Test all three accounts at the production URL, one wrong password, logout and the Sunday/Monday date boundary. You can run `node --test tests/*.test.mjs` locally for schedule and authentication logic.

The site stores a signed, HttpOnly, Secure, SameSite=Lax cookie for up to seven days. Passwords are checked in server functions, never stored in browser code. “Fin de service” does not imply a specific closing time.

The repository is public and includes the schedule logic, so shifts can be inferred from its source even though the site view requires login. For confidential staff schedules, move those shifts into private storage instead.
