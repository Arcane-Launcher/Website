export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/// Where people can reach the developer about privacy or terms questions.
/// Left unset on purpose: when this is a string (an email address or URL),
/// a "Contact" section is appended to both legal pages automatically.
export const LEGAL_CONTACT: string | null = null;

const p = (text: string): LegalBlock => ({ type: "p", text });
const ul = (...items: string[]): LegalBlock => ({ type: "ul", items });

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  description: "What Arcane Launcher stores on your computer, which services it talks to, and what it never collects.",
  updated: "September 19, 2026",
  intro:
    "Arcane Launcher is a desktop app that runs on your computer. It has no accounts with us and no servers of ours that collect your data. This page explains what the launcher keeps on your device and which outside services it contacts on your behalf.",
  sections: [
    {
      heading: "What we collect",
      blocks: [
        p("Nothing. The launcher does not include analytics, telemetry, advertising, or crash reporting, and it does not send your instances, worlds, mods, or settings to us."),
        p("The developers do not receive your Minecraft username, account tokens, IP address, or gameplay information through the launcher."),
      ],
    },
    {
      heading: "What stays on your device",
      blocks: [
        p("The launcher keeps its data in its app data folder on your computer:"),
        ul(
          "Your instances, mod lists, worlds, screenshots, logs, and per-instance history and snapshots.",
          "Saved accounts: for each Microsoft or offline account, the Minecraft username, profile ID (UUID), and the session tokens needed to launch the game. For Microsoft accounts this includes the access token and refresh token.",
        ),
        p("Account data is stored in a plain JSON file in the app data folder. It is not encrypted and is not kept in your operating system's credential store, so anyone or any program with access to your user files could read it. Do not share that folder or include it in bug reports or backups you send to others."),
        p("You can remove a saved account inside the launcher at any time, which deletes it from that file. Uninstalling the launcher and deleting its app data folder removes everything else."),
      ],
    },
    {
      heading: "Services the launcher contacts",
      blocks: [
        p("To do its job, the launcher makes requests directly from your computer to third-party services. Those services can see your IP address and the details of the request, and are governed by their own privacy policies:"),
        ul(
          "Microsoft and Xbox (login.microsoftonline.com, xboxlive.com) and Mojang / Minecraft Services (minecraftservices.com, mojang.com): sign-in, profile, skins, capes, version lists, game files, and assets.",
          "Modrinth and CurseForge: searching and downloading mods, modpacks, resource packs, and checking for updates. CurseForge requests use the API key you provide.",
          "Mod loader sources (Fabric, Quilt, Forge, NeoForge and their file hosts, plus ForgeWrapper files on GitHub and Prism Launcher's file host): downloading loader installers and libraries.",
          "Adoptium: downloading a Java runtime when one is needed.",
          "Google (gstatic.com): a small connectivity check.",
          "The Arcane Launcher update service and GitHub: checking for and downloading new launcher versions (see below).",
        ),
        p("The launcher only contacts these services when you use a feature that needs them, or for background checks such as update checks and connectivity."),
      ],
    },
    {
      heading: "Updates",
      blocks: [
        p("The launcher checks for updates shortly after it starts and periodically afterward. The request goes to this website's update endpoint and includes your operating system, CPU architecture, and current launcher version. The endpoint reads the latest release from GitHub and returns the download link and signature. Downloads are verified against a public key built into the launcher before they can be installed."),
        p("Our hosting provider may keep standard server logs (such as IP address and timestamp) for requests to this website, including the update endpoint. We do not use them to identify individual users."),
      ],
    },
    {
      heading: "Discord Rich Presence",
      blocks: [
        p("If Discord Rich Presence is turned on in the launcher's settings, the launcher talks to your locally running Discord app to show what you are doing, such as which instance you are playing, how long you have played, and party size. Discord then handles that information under its own privacy policy."),
        p("With Ask to Join, the presence can include a join code containing the server address, Minecraft version, and loader so a friend's launcher can offer to join. When someone requests to join, the launcher shows their Discord username and avatar so you can accept or decline. You can turn Rich Presence off in Settings, and nothing is sent to Discord while it is off."),
      ],
    },
    {
      heading: "This website",
      blocks: [
        p("This website does not use advertising or analytics trackers, and we do not set cookies of our own. Like any website, our host and content delivery providers may process basic technical data, such as your IP address and browser type, to serve pages."),
      ],
    },
    {
      heading: "Your choices",
      blocks: [
        ul(
          "Remove saved accounts, or sign out, from the launcher's account menu.",
          "Turn Discord Rich Presence off in Settings.",
          "Skip optional keys (CurseForge, custom Microsoft or Discord client IDs) if you do not want them stored.",
          "Uninstall the launcher and delete its app data folder to erase all locally stored data.",
        ),
      ],
    },
    {
      heading: "Children",
      blocks: [
        p("The launcher does not knowingly collect personal information from anyone, including children. Minecraft and Microsoft accounts are governed by Microsoft's own age and family rules."),
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        p("If the launcher's data practices change, for example by adding a feature that sends data to a new service, we will update this page and its date before or when that version is released."),
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  title: "Terms & Conditions",
  description: "The rules for downloading and using Arcane Launcher.",
  updated: "September 19, 2026",
  intro:
    "By downloading, installing, or using Arcane Launcher you agree to these terms. If you do not agree, do not use the launcher.",
  sections: [
    {
      heading: "What Arcane Launcher is",
      blocks: [
        p("Arcane Launcher is a third-party launcher for Minecraft: Java Edition. It helps you manage instances, mods, modpacks, skins, and game versions. It is developed by Evolutionz and is provided as an early, evolving product; features may change or be removed."),
      ],
    },
    {
      heading: "Not affiliated with Mojang, Microsoft, or others",
      blocks: [
        p("Arcane Launcher is not an official Minecraft product and is not approved by or associated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios. Modrinth, CurseForge, Discord, Fabric, Quilt, Forge, NeoForge, PrismLauncher, and other names mentioned belong to their respective owners, and their use here is for identification only."),
      ],
    },
    {
      heading: "Minecraft license and your account",
      blocks: [
        ul(
          "You need your own legitimate copy of Minecraft: Java Edition to play it. Arcane Launcher does not sell, provide, or unlock the game.",
          "You must follow the Minecraft EULA and Usage Guidelines and Microsoft's terms when using your account.",
          "You are responsible for your accounts and for keeping your computer and the launcher's app data folder secure. See the Privacy Policy for how account data is stored.",
        ),
      ],
    },
    {
      heading: "Using the launcher",
      blocks: [
        p("You may use the launcher for personal, lawful purposes. You agree not to:"),
        ul(
          "use it to break the law, the Minecraft EULA, or the terms of any service it connects to;",
          "attempt to bypass Minecraft's license or account checks, or to misuse another person's account;",
          "remove signature checks from updates, or distribute modified copies of the launcher that pretend to be official releases;",
          "attack, overload, or abuse the update service or the third-party services the launcher connects to.",
        ),
      ],
    },
    {
      heading: "Mods, modpacks, and other content",
      blocks: [
        p("Mods, modpacks, resource packs, and other content you install come from third parties such as Modrinth and CurseForge. Their creators own them and set their licenses. We do not create, review, or guarantee that content, and it may be incompatible, unstable, or unsafe. You install and use it at your own risk and must respect its license terms."),
      ],
    },
    {
      heading: "Changes to your instances and files",
      blocks: [
        p("Some features change or delete files on your computer, such as version upgrades and downgrades, mod updates, and storage cleanup. The launcher shows what it plans to do and can keep snapshots so you can restore, but no tool can guarantee that every mod or world survives a version change. Back up worlds and data you care about before making large changes. You are responsible for reviewing what a cleanup or migration will do before you confirm it."),
      ],
    },
    {
      heading: "Updates",
      blocks: [
        p("The launcher may check for and download updates automatically. Updates are signed, and the launcher only installs updates that match its built-in public key. New versions may change features or these terms."),
      ],
    },
    {
      heading: "Ownership",
      blocks: [
        p("The launcher, its name, logo, and design belong to their creators. You receive a personal, non-exclusive right to install and use the launcher. Your worlds, skins, and other content stay yours."),
      ],
    },
    {
      heading: "No warranty",
      blocks: [
        p("Arcane Launcher is provided “as is” and “as available”, without warranties of any kind, whether express or implied, including fitness for a particular purpose, reliability, or that it will be error-free or uninterrupted."),
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        p("To the fullest extent permitted by law, the developers and contributors are not liable for any indirect, incidental, or consequential damages, or for loss of data, worlds, mods, accounts, or profits, arising from your use of, or inability to use, the launcher or content installed through it. Nothing in these terms limits liability that cannot be limited by law."),
      ],
    },
    {
      heading: "Ending use",
      blocks: [
        p("You can stop using the launcher at any time by uninstalling it. We may stop offering the launcher or its update service, or restrict access if these terms are broken."),
      ],
    },
    {
      heading: "Changes to these terms",
      blocks: [
        p("We may update these terms as the launcher evolves. The date at the top of this page shows the latest revision. Continuing to use the launcher after a change means you accept the updated terms."),
      ],
    },
  ],
};
