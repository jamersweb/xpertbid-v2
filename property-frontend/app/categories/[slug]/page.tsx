import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LoadMoreProperties } from "@/components/LoadMoreProperties";
import { getProperties, getPropertyCategories } from "@/lib/api/client";
import type { CategoryNode } from "@/types/property";

export const revalidate = 180;

type Props = {
  params: Promise<{ slug: string }>;
};

function findCategory(node: CategoryNode, slug: string): CategoryNode | null {
  if (node.slug === slug) return node;
  for (const child of node.children || []) {
    const found = findCategory(child, slug);
    if (found) return found;
  }
  return null;
}

function isChildOf(parent: CategoryNode, slug: string) {
  return (parent.children || []).some((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tree = await getPropertyCategories();
    const cat = findCategory(tree, slug);
    if (!cat) return { title: "Category" };
    return {
      title: `${cat.name} properties`,
      description: `Browse ${cat.name} listings on XpertBid Property.`,
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let tree: CategoryNode;
  try {
    tree = await getPropertyCategories();
  } catch {
    notFound();
  }

  const category = findCategory(tree, slug);
  if (!category) notFound();

  const isTopLevel = tree.slug === slug;
  const filters = isTopLevel
    ? { page: 1, per_page: 12 }
    : isChildOf(tree, slug)
      ? { page: 1, per_page: 12, sub_category: slug }
      : { page: 1, per_page: 12, child_category: slug };

  let result: Awaited<ReturnType<typeof getProperties>> = {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  };

  try {
    result = await getProperties(filters);
  } catch {
    // empty
  }

  return (
    <div className="property-browse-wrap py-4">
      <div className="container-fluid px-3 px-lg-5">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/properties">Properties</Link>
            </li>
            <li className="breadcrumb-item active">{category.name}</li>
          </ol>
        </nav>

        <h1 className="property-browse-title mb-2">{category.name}</h1>
        <p className="text-muted mb-4">Properties in the {category.name} category.</p>

        {category.children?.length ? (
          <div className="d-flex flex-wrap gap-2 mb-4">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="btn btn-outline-dark btn-sm"
                style={{ borderRadius: 8 }}
              >
                {child.name}
              </Link>
            ))}
          </div>
        ) : null}

        {result.data.length ? (
          <LoadMoreProperties
            key={slug}
            initialItems={result.data}
            initialMeta={result.meta}
            filters={filters}
            gridClassName="row g-4"
            itemClassName="col-md-6 col-xl-4"
          />
        ) : (
          <div className="property-empty">No listings in this category yet.</div>
        )}
      </div>
    </div>
  );
}
