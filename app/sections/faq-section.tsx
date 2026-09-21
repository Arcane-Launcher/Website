import { Accordion, Heading } from "@heroui/react";
import { Reveal } from "../components/reveal";
import { FAQS } from "../lib/site-content";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 pb-28 sm:px-10">
      <Reveal>
        <Heading level={2} className="mb-8 text-3xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-4xl">
          Frequently <span className="text-muted">asked</span>
        </Heading>
      </Reveal>

      <Reveal delay={0.05}>
        <Accordion variant="surface" className="border border-border bg-surface">
          {FAQS.map((faq) => (
            <Accordion.Item key={faq.question} id={faq.question}>
              <Accordion.Heading>
                <Accordion.Trigger className="text-sm font-bold text-white">
                  {faq.question}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="text-sm leading-relaxed text-muted">{faq.answer}</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
