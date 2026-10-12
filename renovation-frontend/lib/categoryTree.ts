import type { CategoryNode } from "@/types/property";

export function slugMatches(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (left === right) return true;
  // Seeded slugs often look like `kitchen-renovation-p1176`
  if (left.startsWith(`${right}-p`) || left.startsWith(`${right}-s`)) return true;
  if (right.startsWith(`${left}-p`) || right.startsWith(`${left}-s`)) return true;
  return false;
}

export function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

export function nameIncludes(node: CategoryNode | null | undefined, ...parts: string[]) {
  if (!node) return false;
  const name = normalizeName(node.name);
  const slug = normalizeName(node.slug);
  return parts.every((part) => {
    const needle = part.toLowerCase();
    return name.includes(needle) || slug.includes(needle.replace(/\s+/g, "-"));
  });
}

export function findBuilderRoot(purposes: CategoryNode[]): CategoryNode | null {
  return (
    purposes.find(
      (p) =>
        normalizeName(p.slug).includes("builder") ||
        normalizeName(p.name).includes("builder")
    ) || null
  );
}

export function findChildByName(
  parent: CategoryNode | null | undefined,
  matcher: (node: CategoryNode) => boolean
): CategoryNode | null {
  if (!parent?.children?.length) return null;
  return parent.children.find(matcher) || null;
}
