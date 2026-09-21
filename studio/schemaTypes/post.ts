import { defineArrayMember, defineField, defineType } from "sanity";

/// Keep these two lists in step with the website:
///  - NEWS_BLOCKS mirrors `BlockKey` in website/app/components/block-art.tsx
///    (the site falls back to stone if it gets a value it doesn't know).
///  - Tags are free text on the site; the list here just keeps them consistent.
export const NEWS_BLOCKS = [
  { title: "Grass block", value: "grassSide" },
  { title: "Dirt", value: "dirt" },
  { title: "Stone", value: "stone" },
  { title: "Planks", value: "planks" },
  { title: "Gold ore", value: "gold" },
  { title: "Diamond ore", value: "diamond" },
  { title: "Redstone ore", value: "redstone" },
];

export const NEWS_TAGS = ["Feature", "Launcher", "Release", "Fix", "Announcement"];

const noteType = defineArrayMember({
  name: "note",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Tip (accent)", value: "tip" },
          { title: "Heads up (amber)", value: "warn" },
        ],
        layout: "radio",
      },
      initialValue: "tip",
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { title: "text", tone: "tone" },
    prepare: ({ title, tone }) => ({ title, subtitle: tone === "warn" ? "Heads up" : "Tip" }),
  },
});

const codeType = defineArrayMember({
  name: "code",
  title: "Code block",
  type: "object",
  fields: [defineField({ name: "code", title: "Code", type: "text", rows: 5, validation: (rule) => rule.required() })],
  preview: {
    select: { title: "code" },
    prepare: ({ title }) => ({ title: String(title ?? "").split("\n")[0], subtitle: "Code block" }),
  },
});

export const postType = defineType({
  name: "post",
  title: "News post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      description: "The post's address: arcane…/news/<slug>. Generate it from the title, and don't change it after publishing or old links break.",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      description: "Set a future date and the post appears on the site by itself when that time arrives.",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      options: { list: NEWS_TAGS.map((tag) => ({ title: tag, value: tag })) },
      initialValue: "Feature",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "block",
      title: "Block art",
      description: "The Minecraft block shown next to the post on the news pages.",
      type: "string",
      options: { list: NEWS_BLOCKS },
      initialValue: "stone",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      description:
        "Optional. Drag an image in or click Upload. Shown large on the News page, at the top of the post, and in link previews. Wide images (16:9) look best. Leave it empty to show the block art instead.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          description: "Describe the image for people who can't see it.",
          type: "string",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const cover = context.parent as { asset?: unknown } | undefined;
              return cover?.asset && !alt?.trim() ? "Add alt text for the cover image" : true;
            }),
        }),
      ],
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "One or two sentences shown on the news page and in link previews.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(20).max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Section heading", value: "h2" },
            { title: "Subheading", value: "h3" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            // The site renders bold, inline code, and links. Italics aren't styled, so they aren't offered.
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    description: "https://… or a path on this site like /docs.",
                    type: "url",
                    validation: (rule) => rule.required().uri({ scheme: ["https"], allowRelative: true }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Image",
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              description: "Describe the image for people who can't see it.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
        codeType,
        noteType,
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", tag: "tag", date: "publishedAt", media: "cover" },
    prepare: ({ title, tag, date, media }) => ({
      title,
      media,
      subtitle: `${tag ?? "News"} · ${date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "no date"}`,
    }),
  },
});
