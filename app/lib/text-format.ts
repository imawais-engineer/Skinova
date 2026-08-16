export function stripMarkdown(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function countSentences(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return 0;
  }

  return cleaned.split(/(?<=[.!?])\s+/).filter(Boolean).length;
}

export function limitSentences(text: string, max = 3) {
  const cleaned = stripMarkdown(text).replace(/\s+/g, " ").trim();
  const parts = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);

  if (parts.length <= max) {
    return parts.join(" ");
  }

  return parts.slice(0, max).join(" ");
}
