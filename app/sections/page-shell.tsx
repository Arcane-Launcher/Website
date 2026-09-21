import { PageLoadReveal } from "../components/page-load-reveal";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/// Header + footer chrome shared by every sub-page (legal, news, ...).
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PageLoadReveal />
      <SiteHeader />
      <main className="flex-1 px-6 pt-12 pb-24 sm:px-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
