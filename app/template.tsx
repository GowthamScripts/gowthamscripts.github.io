/** Re-mounted on every navigation, so each page fades and rises in (docs/09-ux.md A5). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-enter">{children}</div>;
}
