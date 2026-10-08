import { useEffect } from "react";
const normalizeJsonText = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  const withoutScripts = value.replace(/^\uFEFF/, "").replace(/<!--[\s\S]*?-->/g, " ").replace(/<script\b[^>]*>/gi, " ").replace(/<\/script>/gi, " ").trim();
  if (typeof document === "undefined") {
    return withoutScripts.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutScripts;
  return textarea.value.trim();
};
const readJsonValue = (text, start) => {
  const opener = text[start];
  if (opener !== "{" && opener !== "[") {
    return null;
  }
  const pair = { "{": "}", "[": "]" };
  const stack = [opener];
  let inString = false;
  let escaped = false;
  for (let index = start + 1; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }
    if (char === "}" || char === "]") {
      const last = stack[stack.length - 1];
      if (!last || pair[last] !== char) {
        return null;
      }
      stack.pop();
      if (stack.length === 0) {
        const slice = text.slice(start, index + 1);
        try {
          return { value: JSON.parse(slice), end: index + 1 };
        } catch (error) {
          return null;
        }
      }
    }
  }
  return null;
};
const extractSchemaMarkupBlocks = (schemaMarkup) => {
  if (typeof schemaMarkup !== "string") {
    return [];
  }
  const rawMarkup = schemaMarkup.trim();
  if (!rawMarkup) {
    return [];
  }
  const searchable = normalizeJsonText(rawMarkup);
  if (!searchable) {
    return [];
  }
  const blocks = [];
  let cursor = 0;
  while (cursor < searchable.length) {
    const objectStart = searchable.indexOf("{", cursor);
    const arrayStart = searchable.indexOf("[", cursor);
    const starts = [objectStart, arrayStart].filter((value) => value >= 0);
    if (starts.length === 0) {
      break;
    }
    const start = Math.min(...starts);
    const parsed = readJsonValue(searchable, start);
    if (!parsed) {
      cursor = start + 1;
      continue;
    }
    blocks.push(JSON.stringify(parsed.value).replace(/</g, "\\u003c"));
    cursor = parsed.end;
  }
  return blocks;
};
function JsonLdScripts({ markup, idPrefix = "jsonld" }) {
  const blocks = extractSchemaMarkupBlocks(markup);
  const serializedBlocks = JSON.stringify(blocks);
  useEffect(() => {
    document.querySelectorAll("script[data-inertia-jsonld]").forEach((node) => node.remove());
    const nodes = blocks.map((schemaMarkup, index) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-inertia-jsonld", `${idPrefix}-${index}`);
      el.text = schemaMarkup;
      document.head.appendChild(el);
      return el;
    });
    return () => {
      nodes.forEach((node) => node.remove());
    };
  }, [idPrefix, serializedBlocks]);
  return null;
}
export {
  JsonLdScripts as J
};
