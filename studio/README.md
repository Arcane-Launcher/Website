# Arcane Launcher news Studio

This is where news posts are written and published. It's a [Sanity](https://www.sanity.io) Studio: a
web editor with an image uploader, drafts, and a publish button. Posts you publish here show up on the
website's News page, and the site renders them with the same styling as every other article.

The News page shows only what's published here. Without Sanity configured, it shows "Nothing here yet".

## One-time setup

You need a free Sanity account. Anything that asks you to sign in below is done by you, in your own account.

1. **Create the project.** Go to <https://www.sanity.io/manage>, create a project (any name, e.g.
   "Arcane Launcher"), and keep the default dataset `production`. Copy the **Project ID**.
2. **Configure the Studio.**
   ```powershell
   cd website/studio
   copy .env.example .env      # then open .env and paste the Project ID
   npm install
   npx sanity login
   ```
3. **Try it locally:** `npm run dev` opens the Studio at <http://localhost:3333>.
   If it complains about CORS, allow it once: `npx sanity cors add http://localhost:3333 --credentials`.
4. **Host it** so editors don't need this folder: `npm run deploy`. Sanity hosts it for free at
   `https://<name>.sanity.studio`. Invite writers under *sanity.io/manage → Members*; only members can publish.
5. **Connect the website.** In the website's environment (`.env.local` for dev, your host's settings in
   production) set:
   ```
   SANITY_PROJECT_ID=<the Project ID>
   ```
   Redeploy the site. Posts you publish appear on News within a minute.
6. **Make publishing instant (optional).** Add a long random `SANITY_REVALIDATE_SECRET` to the website's
   environment, then in *sanity.io/manage → API → Webhooks* add a webhook: URL
   `https://<your-site>/api/revalidate?secret=<that secret>`, method POST, dataset `production`, trigger on
   create, update, and delete, filter `_type == "post"`, and leave the projection empty.

## Loading posts from a file (optional)

To load ready-made posts in one go, put them in an `.ndjson` file (one post document per line) and import it
with your own Studio login, no API token needed:

```powershell
cd website/studio
npx sanity login
npx sanity dataset import ../news-import.ndjson production --missing
```

`--missing` skips any post that already exists, so it's safe to repeat.

## Writing a post

- **Publish date** decides when it appears. Set a future date and it goes live by itself at that time.
- **URL slug** becomes `/news/<slug>`. Generate it from the title, and don't change it after publishing.
- **Block art** picks the Minecraft block shown beside the post.
- **Cover image** (optional) is uploaded right in the form: click *Upload* or drag an image in. It replaces the
  block art on the News page and is shown at the top of the post and in link previews. Use a wide 16:9 image;
  alt text is required once an image is set.
- **Body** supports section headings, bullets, numbered steps, bold, inline code, links, images, code blocks,
  and callouts (Tip or Heads up). Images need alt text.

Drafts never appear on the site; only published posts do.

## Development

```powershell
npm run typecheck          # TypeScript
npm run schema:validate    # Sanity's own schema check
npm run build              # bundle the Studio
```

Two lists are duplicated from the website and must stay in step: the block-art options in
`schemaTypes/post.ts` (`NEWS_BLOCKS`) mirror `BlockKey` in `app/components/block-art.tsx`, and the body's
allowed content mirrors what `app/lib/portable-text.ts` converts. If you add a block type to the schema,
teach `portable-text.ts` about it too, or the site will quietly skip it.
