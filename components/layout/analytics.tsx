import Script from "next/script";

/**
 * Privacy-first, cookie-less analytics (Plausible, or anything that speaks its script protocol).
 * Off by default: nothing loads unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, and never on
 * preview deployments.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain || process.env.VERCEL_ENV === "preview") return null;
  return (
    <Script
      defer
      data-domain={domain}
      src={
        process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.outbound-links.js"
      }
      strategy="afterInteractive"
    />
  );
}
