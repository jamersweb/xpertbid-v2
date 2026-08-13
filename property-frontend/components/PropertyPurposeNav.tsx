"use client";

import Link from "next/link";
import type { CategoryNode } from "@/types/property";

type Props = {
  purposes: CategoryNode[];
};

export function PropertyPurposeNav({ purposes }: Props) {
  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center property-purpose-nav">
      <li className="nav-item">
        <Link href="/properties?listing_type=normal" className="nav-link property-nav-link">
          All Properties
        </Link>
      </li>

      {purposes.map((purpose) => (
        <li key={purpose.id} className="nav-item">
          <Link
            href={`/properties?sub_category=${encodeURIComponent(purpose.slug)}&listing_type=normal`}
            className="nav-link property-nav-link"
          >
            {purpose.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
