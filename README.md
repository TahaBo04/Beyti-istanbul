# Beyti Istanbul — planning d’équipe

Simple mobile-friendly weekly schedule for Nouhayla, Kaoutar and Abderahim. Select a name to see that person's shift today in Casablanca and their full week.

This is a static site: deploy the repository root to Vercel with the **Other** framework preset. No build command, API, accounts, passwords or environment variables are needed.

The schedule is public to anyone with the site link. “Fin de service” means closing time; its exact hour is set by the manager. Saturday and Sunday use the revised rotation.

Run `node --test tests/schedule.test.mjs` to check the schedule logic.
