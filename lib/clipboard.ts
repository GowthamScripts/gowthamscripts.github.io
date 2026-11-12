/** Copies text. Uses the Clipboard API; falls back to a hidden text box where that API is blocked. */
export async function writeToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const box = document.createElement("textarea");
    box.value = value;
    box.setAttribute("readonly", "");
    box.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(box);
    box.select();
    const copied = document.execCommand("copy");
    box.remove();
    if (!copied) throw new Error("Copy was blocked");
  }
}
