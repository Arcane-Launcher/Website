import { screenshotSrc } from "./cloudinary";

export const LOADER_BADGES = ["Fabric", "Forge", "NeoForge", "Quilt"];
export const LAUNCHER_BADGES = ["PrismLauncher", "CurseForge", "TLauncher", "SKlauncher", "Modrinth App"];
export const INTEGRATIONS = [ "MOJANG", "MODRINTH", "DISCORD"];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Which mod loaders does Arcane Launcher support?",
    answer:
      "Fabric, Forge, NeoForge, and Quilt. Arcane Instance Evolution runs real compatibility checks against every installed mod before anything changes, across all four.",
  },
  {
    question: "Can I bring over instances from another launcher?",
    answer:
      "Yes — import from PrismLauncher, CurseForge, TLauncher, SKlauncher, or the Modrinth App. Mods, worlds, and configs come along as-is.",
  },
  {
    question: "Is it safe to upgrade or downgrade a Minecraft version?",
    answer:
      "Every version change takes an automatic snapshot first, so a bad upgrade or downgrade is one click to undo.",
  },
  {
    question: "Do I need a Microsoft account to play?",
    answer:
      "Sign in with Microsoft or play offline, and switch between multiple saved accounts in a click.",
  },
  {
    question: "Does it keep my modpacks up to date?",
    answer:
      "Yes — instances installed from a modpack are checked for new versions automatically. When one is available you can update in one click and see which mods were added or changed.",
  },
  {
    question: "Can I back up or share an instance?",
    answer:
      "Export any instance as a .zip, or duplicate it into a new one — mods, config, saves, and resource packs come along, and shared libraries aren't re-downloaded.",
  },
  {
    question: "Why isn't it built on Electron?",
    answer:
      "Arcane Launcher is a Tauri app under the hood — small install size, low idle memory, and a launcher that opens instantly.",
  },
];

export type Showcase = {
  title: React.ReactNode;
  description: string;
  windowLabel: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

export const SHOWCASES: Showcase[] = [
  {
    title: (
      <>
        Thousands of mods, <span className="text-muted">one search away</span>
      </>
    ),
    description:
      "Browse and install straight from Modrinth without leaving the launcher — filter by loader, category, and Minecraft version, then hit install.",
    windowLabel: "Arcane Launcher — Browse Mods",
    image: screenshotSrc("mods"),
    alt: "Arcane Launcher's mod browser showing search, loader and category filters, and one-click installs for mods like Sodium and Iris Shaders",
    width: 1178,
    height: 688,
  },
  {
    title: (
      <>
        Your skin, <span className="text-muted">your way</span>
      </>
    ),
    description:
      "Upload a PNG, save and favorite your go-tos, and preview every skin on a real 3D model before you switch — drag to rotate, scroll to zoom.",
    windowLabel: "Arcane Launcher — Skins",
    image: screenshotSrc("skinuploader"),
    alt: "Arcane Launcher's skin studio showing a rotatable 3D character preview next to a saved skins list with a drag-and-drop upload option",
    width: 1199,
    height: 695,
  },
  {
    title: (
      <>
        Make it <span className="text-muted">yours</span>
      </>
    ),
    description:
      "Nine background palettes, six fonts, and a custom accent color — the launcher's whole look, tuned to your taste.",
    windowLabel: "Arcane Launcher — Appearance",
    image: screenshotSrc("apperance"),
    alt: "Arcane Launcher's appearance settings showing theme palette, font, and accent color pickers",
    width: 1181,
    height: 718,
  },
];

export type MoreFeature = { title: string; description: string };

export const MORE_FEATURES: MoreFeature[] = [
  {
    title: "Full skin & cape studio",
    description: "A real 3D viewer with idle, walk, run, and wave poses. Import by username, by direct link, or drag a PNG in.",
  },
  {
    title: "Discord Ask to Join",
    description: "Accept or decline join requests from inside the launcher — accepted invites auto-suggest the matching instance to launch and join.",
  },
  {
    title: "One-click storage cleanup",
    description: "Scans old version caches, logs, and backups with a category breakdown — review exactly what's selected before anything is deleted.",
  },
  {
    title: "Self-updating",
    description: "Checks for new launcher versions, downloads and installs them in the background, then restarts when you're ready.",
  },
  {
    title: "Microsoft & offline accounts",
    description: "Sign in with Microsoft or play offline, and switch between multiple saved accounts in a click.",
  },
  {
    title: "Worlds, servers & screenshots",
    description: "Every instance keeps its own worlds, saved servers, and screenshot gallery, all one click away from the launch button.",
  },
  {
    title: "Mod profiles & load order",
    description: "Save mod profile setups per instance and reorder resource pack overlays without touching a config file.",
  },
  {
    title: "Built native, not Electron",
    description: "A Tauri app under the hood — small install size, low idle memory, and a launcher that opens instantly.",
  },
  {
    title: "Modpack update checks",
    description: "Instances installed from a modpack are checked for new versions automatically — update in one click and see exactly which mods were added or changed.",
  },
  {
    title: "Live download queue",
    description: "Pause, resume, or cancel any download, with live speed, ETA, and a combined throughput readout while several run at once.",
  },
  {
    title: "Groups, favorites & duplicates",
    description: "Sort instances into collapsible groups, pin favorites to the top, or duplicate one without re-downloading shared libraries.",
  },
  {
    title: "Console, history & recovery",
    description: "A live launch console per instance, a full version-change history, and one-click restore if a migration is ever interrupted.",
  },
  {
    title: "Personalized theme",
    description: "Pick an accent color, font, and layout preset so the launcher looks like yours, not a default install.",
  },
];
