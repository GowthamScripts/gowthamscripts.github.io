import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyButton } from "@/components/shared/copy-button";
import { PageIntro } from "@/components/shared/page-intro";
import { getContact, getProfile, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

export default function Page() {
  const contact = getContact();
  const profile = getProfile();
  const testimonial = getTestimonials()[0];
  const lookingFor = [
    ["Status", contact.lookingFor.status],
    ["Roles", contact.lookingFor.roles.join(", ")],
    ["Focus", contact.lookingFor.focus.join(", ")],
    ["Work mode", contact.lookingFor.workMode],
    ["Area", contact.lookingFor.area],
  ] as const;
  const tile =
    "flex min-h-14 items-center gap-3 rounded-xl border bg-card px-4 py-3 font-medium transition-colors hover:border-primary/40";

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <PageIntro href="/contact" />
          {profile.availability.open && (
            <p className="mt-6 flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-success" aria-hidden />
              {profile.availability.label}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{contact.replyTime}</p>

          <ul className="mt-8 space-y-3">
            <li className="flex items-stretch gap-2">
              <a href={`mailto:${contact.email}`} className={`${tile} min-w-0 flex-1`}>
                <Mail className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{contact.email}</span>
              </a>
              <CopyButton
                text={contact.email}
                label="Copy"
                copiedMessage="Email copied"
                className="h-auto px-4"
              />
            </li>
            {contact.links.calendar && (
              <li>
                <a href={contact.links.calendar} target="_blank" rel="noreferrer" className={tile}>
                  <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />
                  Book a 20-minute intro
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            <li>
              <a href={contact.links.linkedin} target="_blank" rel="noreferrer" className={tile}>
                <ArrowUpRight className="size-5 shrink-0 text-primary" aria-hidden />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>

          <section aria-labelledby="looking-for" className="mt-10">
            <h2 id="looking-for" className="text-xl font-semibold tracking-tight">
              What I&apos;m looking for
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              {lookingFor.map(([term, value]) => (
                <div key={term} className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {testimonial && (
            <figure className="mt-10 border-l-2 border-primary pl-4">
              <blockquote className="text-pretty">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                {testimonial.name} · {testimonial.title}
              </figcaption>
            </figure>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ContactForm email={contact.email} />
        </div>
      </div>
    </div>
  );
}
