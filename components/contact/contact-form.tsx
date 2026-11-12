"use client";

import { CircleCheck, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  emptyContactForm,
  fieldErrors,
  reasons,
  type ContactField,
  type ContactFormValues,
} from "@/lib/contact-form";
import { track } from "@/lib/analytics";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

const DRAFT_KEY = "contact-draft";

/** The site is static, so the message is handed to the visitor's own email app. */
function mailtoLink(to: string, values: ContactFormValues) {
  const reason = reasons.find((option) => option.value === values.reason)?.label ?? values.reason;
  const body = [
    values.message,
    "",
    "—",
    values.name,
    values.email,
    values.company && `Company: ${values.company}`,
    values.roleLink && `Role: ${values.roleLink}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const subject = `${reason}: message from ${values.name}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ email }: { email: string }) {
  const [opened, setOpened] = useState<string | null>(null);

  // The draft lives in localStorage, so a half-written message survives leaving the page.
  const [draft, setDraft] = useLocalStorage(DRAFT_KEY);
  const values = useMemo<Record<ContactField, string>>(() => {
    try {
      return { ...emptyContactForm, ...(draft ? JSON.parse(draft) : {}) };
    } catch {
      return emptyContactForm;
    }
  }, [draft]);

  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Honeypot: real visitors never see or fill this field.
    if (new FormData(event.currentTarget).get("website")) return;
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    track("Contact Sent");
    window.location.href = mailtoLink(email, parsed.data);
    setOpened(parsed.data.name);
  }

  function update(field: ContactField, value: string) {
    setDraft(JSON.stringify({ ...values, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  // Check a field when the visitor leaves it, not on every keystroke.
  function validate(field: ContactField) {
    const result = contactFormSchema.shape[field].safeParse(values[field]);
    setErrors((current) => ({
      ...current,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }

  if (opened !== null) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-xl border bg-card p-6 sm:p-8"
      >
        <CircleCheck className="size-8 text-success" aria-hidden />
        <h2 className="text-xl font-semibold tracking-tight">
          Thanks{opened ? `, ${opened.split(" ")[0]}` : ""}. Your email app should now be open.
        </h2>
        <p className="text-muted-foreground">
          Press send there and I&apos;ll reply within 1–2 business days. If nothing opened, copy
          your message and email me at{" "}
          <a href={`mailto:${email}`} className="font-medium underline underline-offset-4">
            {email}
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={values.message}
            label="Copy my message"
            copiedMessage="Message copied"
          />
          <Button
            variant="outline"
            onClick={() => {
              setDraft(null);
              setOpened(null);
            }}
          >
            Start a new message
          </Button>
        </div>
      </div>
    );
  }

  const hint = reasons.find((reason) => reason.value === values.reason)?.hint;
  const field = (name: ContactField) => ({
    id: name,
    name,
    value: values[name],
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => update(name, event.target.value),
    onBlur: () => validate(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: ContactField) =>
    errors[name] && (
      <p id={`${name}-error`} className="text-sm text-destructive">
        {errors[name]}
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-xl border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">Send a message</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input {...field("name")} autoComplete="name" required className="h-11" />
          {error("name")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...field("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className="h-11"
          />
          {error("email")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input {...field("company")} autoComplete="organization" className="h-11" />
          {error("company")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <select
            {...field("reason")}
            className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          >
            {reasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          {error("reason")}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleLink">
          Link to the role <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          {...field("roleLink")}
          type="url"
          inputMode="url"
          placeholder="https://"
          className="h-11"
        />
        {error("roleLink")}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          {...field("message")}
          required
          rows={6}
          placeholder={hint}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {error("message")}
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" size="lg" className="h-12 w-full px-5 text-base sm:w-auto">
        <Send data-icon="inline-start" />
        Write the email
      </Button>
      <p className="text-sm text-muted-foreground">
        Opens your email app with the message ready to send.
      </p>
    </form>
  );
}
