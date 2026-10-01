import type { Metadata } from "next";
import Link from "next/link";
import { LoadMoreProperties } from "@/components/LoadMoreProperties";
import { getProperties } from "@/lib/api/client";

export const revalidate = 180;

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const label = decodeURIComponent(city).replace(/-/g, " ");
  const titled = label.replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Properties in ${titled}`,
    description: `Browse homes and land for sale or rent in ${titled}.`,
  };
}

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const cityName = decodeURIComponent(city).replace(/-/g, " ");
  const filters = { city: cityName, page: 1, per_page: 12 };

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
            <li className="breadcrumb-item active">{cityName}</li>
          </ol>
        </nav>

        <h1 className="property-browse-title mb-2">Properties in {cityName}</h1>
        <p className="text-muted mb-4">Active listings matching this city.</p>

        {result.data.length ? (
          <LoadMoreProperties
            key={city}
            initialItems={result.data}
            initialMeta={result.meta}
            filters={filters}
            gridClassName="row g-4"
            itemClassName="col-md-6 col-xl-4"
          />
        ) : (
          <div className="property-empty">No properties found for {cityName}.</div>
        )}
      </div>
    </div>
  );
}
