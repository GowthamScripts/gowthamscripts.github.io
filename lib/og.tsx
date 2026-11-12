import { ImageResponse } from "next/og";

export const shareImageSize = { width: 1200, height: 630 };

/**
 * The share image used in link previews. Always light, so previews look the same everywhere.
 * An optional metric ("40×", "faster settlement") is shown large on the right.
 */
export function renderShareImage({
  eyebrow,
  title,
  subtitle,
  metric,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  metric?: { value: string; label: string };
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#fbfaf8",
        color: "#15191f",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#0b6b78", letterSpacing: 4 }}>
        {eyebrow.toUpperCase()}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 62 : 80,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 32, color: "#565d68", lineHeight: 1.3 }}>
              {subtitle}
            </div>
          )}
        </div>
        {metric && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              borderLeft: "3px solid #d9d7d2",
              paddingLeft: 48,
            }}
          >
            <div style={{ display: "flex", fontSize: 104, fontWeight: 700, color: "#0b6b78" }}>
              {metric.value}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#565d68" }}>{metric.label}</div>
          </div>
        )}
      </div>
      <div
        style={{ display: "flex", height: 10, width: 160, background: "#0b6b78", borderRadius: 5 }}
      />
    </div>,
    shareImageSize,
  );
}

/** Square initials mark, used for the browser tab icon and the home-screen icon. */
export function renderIcon(initials: string, size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#15191f",
        color: "#fbfaf8",
        fontSize: size * 0.46,
        fontWeight: 700,
        borderRadius: size * 0.22,
      }}
    >
      {initials}
    </div>,
    { width: size, height: size },
  );
}
