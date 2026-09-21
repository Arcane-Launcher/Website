# Arcane Launcher website

The public website for [Arcane Launcher](https://github.com/Arcane-Launcher), a Minecraft launcher for
Windows, and the update service the launcher checks for new versions.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and HeroUI. Animation is GSAP and Lenis.

## What's in it

| Page | What it shows |
| --- | --- |
| `/` | Landing page: hero, feature grid, product screenshots, FAQ |
| `/news`, `/news/[slug]` | News posts, written and published in a Sanity Studio |
| `/changelog` | Every published launcher release, read live from GitHub Releases |
| `/compare` | How Arcane compares with other launchers. Only facts that can be checked are listed |
| `/privacy`, `/terms` | Legal pages |
| `/api/updates/[target]/[arch]/[currentVersion]` | The launcher's update check, following [Tauri's updater contract](https://v2.tauri.app/plugin/updater/) |
| `/api/revalidate` | Webhook that makes a published news post show up immediately |

There is no database and no separate backend. News lives in Sanity, releases live in GitHub.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill it in, see below
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment variables

Set them in `.env.local` while developing, or in your host's environment settings in production.
Values are read at build time, so redeploy after changing them.

| Variable | Needed | What it does |
| --- | --- | --- |
| `GITHUB_REPO` | Yes | `owner/repo` whose Releases are the launcher's update source. Drives the update API, the changelog and the footer's GitHub link |
| `GITHUB_TOKEN` | No | Read-only token that raises GitHub's API limit from 60 to 5000 requests an hour |
| `DISCORD_INVITE_URL` | No | `https://` invite link. Without it, no Discord link appears in the footer |
| `SANITY_PROJECT_ID` | For news | Sanity project ID. Without it the News page is empty |
| `SANITY_DATASET` | No | Defaults to `production` |
| `SANITY_READ_TOKEN` | No | Only if the Sanity dataset is private |
| `SANITY_REVALIDATE_SECRET` | No | Any long random string. Switches on `/api/revalidate` |

See [`.env.example`](.env.example) for the details of each one.

## News (Sanity)

Posts are written in the Studio in [`studio/`](studio/README.md), a separate small project that Sanity
hosts for free. The website reads published posts over Sanity's HTTP API, turns their rich text into
the site's own article styling, and caches the result for a minute.

- Each post has a title, slug, publish date, tag, block art, summary, optional cover image and a body
  (headings, lists, links, images, code blocks and callouts).
- A publish date in the future makes the post appear by itself at that time. Drafts never show.
- For instant updates, add a Sanity webhook that POSTs to
  `https://<your-site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`.

Setup steps are in [`studio/README.md`](studio/README.md).

## Screenshots (Cloudinary)

The product screenshots on the landing page are hosted on Cloudinary instead of being stored here.
Their URLs are listed in [`app/lib/cloudinary.ts`](app/lib/cloudinary.ts). To change one, upload the new
image in Cloudinary's Media Library and paste its URL there. The Cloudinary account is allowed in
`next.config.ts`.

## Update service

The launcher asks `/api/updates/{{target}}/{{arch}}/{{current_version}}` whether a newer version exists.
The route looks at the latest **non-draft, non-prerelease** GitHub Release of `GITHUB_REPO` and answers:

- `204 No Content` when there is nothing newer, or no installer and `.sig` file for that platform.
- `200` with `{ version, url, signature, notes, pub_date }` when there is. The release description is
  used as the update notes.

There is no release list to maintain here. Publishing a GitHub Release that contains the signed installer
(for example `Arcane.Launcher_1.2.3_x64-setup.exe`) and its `.sig` file is what makes installed
launchers update. The launcher only installs builds signed with its own key.

Only Windows is listed in `PLATFORM_ASSETS` in the route, because that is all the launcher ships. Add a
row there when another platform is released.

## Deploying

The site is a standard Next.js app, so it deploys to Vercel or any Node host.

1. Import this repo (on Vercel, the repo root is the project root).
2. Set the environment variables above, at least `GITHUB_REPO` and `SANITY_PROJECT_ID`.
3. Point the launcher's updater endpoint at your domain, in the launcher project's `tauri.conf.json`:

   ```text
   https://<your-domain>/api/updates/{{target}}/{{arch}}/{{current_version}}
   ```

## Project layout

```text
app/
  api/            update service and Sanity webhook
  components/     shared UI: background, block art, article blocks, reveal animations
  lib/            content, GitHub and Sanity clients, Cloudinary URLs
  sections/       page sections: header, footer, hero, features, FAQ
  news/ changelog/ compare/ privacy/ terms/    the pages
studio/           the Sanity Studio where news is written
public/           logo (screenshots are on Cloudinary)
```
