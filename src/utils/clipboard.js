export const writeClipboardText = async (text) => {
  const value = String(text ?? "");
  if (!value) return false;

  if (navigator?.clipboard?.writeText && document.hasFocus?.()) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the textarea method below.
    }
  }

  let textarea = null;
  let previousRange = null;

  try {
    const selection = document.getSelection?.();
    if (selection?.rangeCount) {
      previousRange = selection.getRangeAt(0);
    }

    textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    if (textarea?.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }

    if (previousRange) {
      const selection = document.getSelection?.();
      selection?.removeAllRanges();
      selection?.addRange(previousRange);
    }
  }
};
