import { z } from "zod";

/** Contact form rules, checked in the browser on blur and again on submit. */

export const reasons = [
  {
    value: "hiring",
    label: "Hiring / role opportunity",
    hint: "Tell me about the team, the role, and the problem you're solving.",
  },
  {
    value: "open-source",
    label: "Open-source collaboration",
    hint: "Which project, and what do you have in mind?",
  },
  {
    value: "speaking",
    label: "Speaking / writing",
    hint: "What's the event or publication, and the topic?",
  },
  {
    value: "mentorship",
    label: "Mentorship",
    hint: "Where are you in your career, and what would you like help with?",
  },
  { value: "other", label: "Other", hint: "What's on your mind?" },
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(100, "That company name is too long."),
  reason: z.enum(
    reasons.map((reason) => reason.value),
    "Please choose a reason.",
  ),
  roleLink: z.union([
    z.literal(""),
    z
      .url({ protocol: /^https?$/, error: "Please enter a full link, starting with https://" })
      .max(500),
  ]),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence.")
    .max(5000, "Please keep the message under 5,000 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactField = keyof ContactFormValues;

export const emptyContactForm: Record<ContactField, string> = {
  name: "",
  email: "",
  company: "",
  reason: "hiring",
  roleLink: "",
  message: "",
};

/** First error message per field. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message;
  }
  return errors;
}
