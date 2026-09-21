/// Data behind /compare. Every cell must be something we could point at:
///  - Arcane's own column is checked against the launcher's code.
///  - Other launchers' cells come from their own public pages (listed in
///    COMPETITORS). When a page doesn't say, the cell is "undocumented" — that
///    means "we didn't find it", never "it doesn't exist".
/// Update `COMPARE_CHECKED` whenever the table is re-verified.

export const COMPARE_CHECKED = "2026-09-20";

/// yes        — offered / documented.
/// partial    — offered with a real limit, spelled out in the cell text.
/// notyet     — Arcane doesn't do this yet (only used in Arcane's own column).
/// undocumented — the launcher's own pages don't mention it.
export type Support = "yes" | "partial" | "notyet" | "undocumented";

export type Cell = { state: Support; text?: string };

export type Competitor = {
  key: "prism" | "curseforge" | "modrinth" | "tlauncher";
  name: string;
  /// The page the cells in this column were read from.
  source: string;
};

export const COMPETITORS: Competitor[] = [
  { key: "prism", name: "Prism Launcher", source: "https://prismlauncher.org/" },
  { key: "curseforge", name: "CurseForge app", source: "https://www.curseforge.com/download/app" },
  { key: "modrinth", name: "Modrinth App", source: "https://modrinth.com/app" },
  { key: "tlauncher", name: "TLauncher", source: "https://tlauncher.org/en/" },
];

export type CompareRow = {
  feature: string;
  hint?: string;
  arcane: Cell;
  others: Record<Competitor["key"], Cell>;
};

const undocumented: Cell = { state: "undocumented" };

export const COMPARE_ROWS: CompareRow[] = [
  {
    feature: "Platforms",
    arcane: { state: "notyet", text: "Windows only for now" },
    others: {
      prism: { state: "yes", text: "Windows, macOS, Linux" },
      curseforge: { state: "yes", text: "Windows, macOS, Linux" },
      modrinth: { state: "yes", text: "Windows, macOS, Linux" },
      tlauncher: { state: "yes", text: "Windows, macOS, Linux" },
    },
  },
  {
    feature: "Mods and modpacks built in",
    hint: "Where the in-app browser gets its content.",
    arcane: { state: "partial", text: "Modrinth. CurseForge browsing isn't available yet" },
    others: {
      prism: { state: "yes", text: "Modrinth and CurseForge" },
      curseforge: { state: "yes", text: "CurseForge" },
      modrinth: { state: "yes", text: "Modrinth" },
      tlauncher: { state: "yes", text: "Its own catalog" },
    },
  },
  {
    feature: "Import instances from other launchers",
    arcane: { state: "yes", text: "Prism/MultiMC, CurseForge app, TLauncher, SKlauncher, Modrinth App" },
    others: {
      prism: undocumented,
      curseforge: undocumented,
      modrinth: { state: "yes", text: "GDLauncher and MultiMC are named on its site" },
      tlauncher: undocumented,
    },
  },
  {
    feature: "Guided version upgrade or downgrade",
    hint: "A compatibility scan of every mod, a snapshot first, and one-click rollback.",
    arcane: { state: "yes", text: "Instance Evolution" },
    others: { prism: undocumented, curseforge: undocumented, modrinth: undocumented, tlauncher: undocumented },
  },
  {
    feature: "Pre-launch health check",
    hint: "A score before you press Play, with a one-click fix for what it finds.",
    arcane: { state: "yes", text: "Smart Launch" },
    others: { prism: undocumented, curseforge: undocumented, modrinth: undocumented, tlauncher: undocumented },
  },
  {
    feature: "In-app skin manager",
    arcane: { state: "yes", text: "3D studio, capes, and a SkinsRestorer hand-off for offline accounts" },
    others: {
      prism: { state: "yes", text: "Manage Skins, with a 3D preview" },
      curseforge: undocumented,
      modrinth: { state: "yes", text: "Skin selector" },
      tlauncher: { state: "yes", text: "Its own skin system" },
    },
  },
];
