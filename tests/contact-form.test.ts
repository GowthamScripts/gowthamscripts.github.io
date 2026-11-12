import { describe, expect, it } from "vitest";
import { contactFormSchema, fieldErrors } from "@/lib/contact-form";

const valid = {
  name: "Test Visitor",
  email: "test@example.com",
  company: "",
  reason: "hiring",
  roleLink: "",
  message: "Hello, this is a message.",
};

describe("contact form rules", () => {
  it("accepts a valid message with the optional fields left empty", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("gives one plain-language error per field", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      name: " ",
      email: "nope",
      message: "hi",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(fieldErrors(result.error)).toEqual({
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Please write at least a sentence.",
    });
  });

  it("only accepts http(s) links for the role", () => {
    const check = (roleLink: string) => contactFormSchema.safeParse({ ...valid, roleLink }).success;
    expect(check("https://example.com/jobs/1")).toBe(true);
    expect(check("example.com/jobs/1")).toBe(false);
    expect(check("javascript:alert(1)")).toBe(false);
  });

  it("rejects a reason that is not on the list", () => {
    expect(contactFormSchema.safeParse({ ...valid, reason: "spam" }).success).toBe(false);
  });
});
