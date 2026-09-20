No outstanding CodeRabbit reviews.



# cli agents sessions
- codex resume 01a0a580-6160-7591-adcd-ad67be730e00
- agy --conversation=a6b4c6fd-02d6-4435-ac47-803a92927d4b-
    - agy --conversation=e79ff9e4-eb3b-4193-b599-f6bd4c0204b5 (for scouting)
    - agy --conversation=e127f013-6040-42ea-9165-0a24284bf120 (for finance)
    - agy --conversation=07cf4a4a-d95a-449e-b8ec-25b596be56d0 (for transfer & medical)
- opencode -s ses_f4c3d2d8bffet1IHC7MIWB4zIs

# Code rabbit reviews

## Deploy the demo to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository. If this is part of a monorepo, set `frontend` as the Root Directory.
3. Confirm the Next.js preset, use `npm install` for installation, use `npm run build` for the build, and leave the output directory at its default.
4. Add the variables from local `.env` in Vercel Project Settings → Environment Variables. Never commit `.env`; configure Preview and Production values separately when needed.
5. Deploy a Preview and verify `/`, `/login`, `/dashboard`, `/dashboard/transfers`, and `/dashboard/medical`.
6. Promote the Preview to Production, or redeploy after changing production environment variables.
7. Optionally add a custom domain under Project Settings → Domains.

### Demo limitations

- Transfer, medical, signing, and other demo data use in-memory mock stores, so changes reset after a full reload, a new server instance, or a redeploy.
- This is suitable for a clickable demo, not production persistence. Add a database/API before using it in production.
- Remote avatar images use Unsplash; keep the existing `images.unsplash.com` configuration in `next.config.ts` or replace the images with local assets.
