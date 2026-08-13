"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export function Gallery({ images, title }: Props) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = list[active] || list[0];

  if (!current) {
    return (
      <div className="property-detail-gallery bg-light rounded-4" style={{ minHeight: 280 }} />
    );
  }

  return (
    <div className="property-detail-gallery">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={title}
        style={{ aspectRatio: "16/10", width: "100%", objectFit: "cover" }}
      />
      {list.length > 1 ? (
        <div className="row g-2 mt-2 property-detail-thumbs">
          {list.slice(0, 8).map((src, index) => (
            <div className="col-3 col-md-2" key={`${src}-${index}`}>
              <button
                type="button"
                className="border-0 bg-transparent p-0 w-100"
                onClick={() => setActive(index)}
                style={{
                  outline: index === active ? "2px solid #43ACE9" : "none",
                  borderRadius: 12,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
