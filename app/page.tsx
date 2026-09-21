import { PageLoadReveal } from "./components/page-load-reveal";
import { FaqSection } from "./sections/faq-section";
import { FeaturesGrid } from "./sections/features-grid";
import { Hero } from "./sections/hero";
import { MoreFeatures } from "./sections/more-features";
import { ProductShowcases } from "./sections/product-showcases";
import { SiteFooter } from "./sections/site-footer";
import { SiteHeader } from "./sections/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <PageLoadReveal />
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        <section id="features" className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
          <FeaturesGrid />
          <ProductShowcases />
          <MoreFeatures />
        </section>

        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
