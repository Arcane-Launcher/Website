## Arcane Launcher — website & update API

The public marketing site for Arcane Launcher, plus the real API its desktop
app checks for updates against (`/api/updates/[target]/[arch]/[currentVersion]`,
implementing Tauri's [dynamic updater
contract](https://v2.tauri.app/plugin/updater/)). No separate backend —
everything here deploys as one Next.js app on Vercel; the API route is a
serverless function.

### Local development

```bash
npm install
npm run dev
```

### Deploying

Push this repo to GitHub, then import it into Vercel as a new project with
**this `website/` folder as the project root** (Vercel → Project Settings →
General → Root Directory). Every push to `main` deploys automatically.

Once it has a real domain, update
`src-tauri/tauri.conf.json`'s `plugins.updater.endpoints` in the main launcher
project to point at it, e.g.:

```
https://<your-domain>/api/updates/{{target}}/{{arch}}/{{current_version}}
```

### Publishing a new release

`releases.json` is the update API's real data source — it starts empty and
stays empty until you actually publish a build. To ship version `X.Y.Z`:

1. Build and sign it from the main project:
   ```bash
   cd ..
   TAURI_SIGNING_PRIVATE_KEY="$(cat .tauri-updater.key)" npx tauri build
   ```
   This produces the installer(s) under `src-tauri/target/release/bundle/`
   plus a matching `.sig` file for each — the signature the updater verifies
   before installing anything.
2. Upload the installer(s) somewhere with a stable public URL — a GitHub
   Release on this project's repo is the natural choice (free, versioned,
   built for exactly this).
3. Add an entry to `releases.json`:
   ```json
   {
     "version": "X.Y.Z",
     "notes": "What changed.",
     "pub_date": "2026-01-01T00:00:00Z",
     "platforms": {
       "windows-x86_64": {
         "url": "https://github.com/<you>/<repo>/releases/download/vX.Y.Z/Arcane.Launcher_X.Y.Z_x64-setup.exe",
         "signature": "<contents of the matching .sig file>"
       }
     }
   }
   ```
   Add one `platforms` entry per target you built for. A release doesn't
   need to cover every platform at once.
4. Commit and push — the next deploy makes it live. Existing installs
   running an older version will see it on their next update check.

Never hand-write a version into `releases.json` that wasn't actually built
and signed this way — the API trusts this file completely, so a fabricated
entry would tell real users' launchers to download something that doesn't
match its claimed signature (or doesn't exist at all).
