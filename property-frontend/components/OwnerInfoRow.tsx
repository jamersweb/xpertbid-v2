"use client";

import { assetImage } from "@/lib/site";

function formatName(name = "") {
  const safeName = String(name ?? "").trim();
  const formatted =
    safeName
      .split(" ")
      .filter(Boolean)
      .slice(0, 5)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "User";

  return formatted.length > 15 ? `${formatted.substring(0, 15)}...` : formatted;
}

function buildAvatarUrl(avatar?: string | null) {
  if (!avatar) return assetImage("user.jpg");
  if (avatar.startsWith("http")) return avatar;
  const normalized = String(avatar).replace(/\\/g, "/");
  if (normalized.startsWith("/")) return normalized;
  return `/${normalized.replace(/^\/+/, "")}`;
}

type Props = {
  name?: string | null;
  avatarUrl?: string | null;
  isFeatured?: boolean;
};

export function OwnerInfoRow({ name, avatarUrl, isFeatured = false }: Props) {
  const displayName = formatName(name || "");
  const avatarSrc = buildAvatarUrl(avatarUrl);

  return (
    <div className="owner-info-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc}
        alt={displayName}
        onError={(e) => {
          e.currentTarget.src = assetImage("user.jpg");
        }}
      />
      <div className="owner-info-row__content">
        <span className="owner-info-row__identity">
          <span className="owner-info-row__name-text">{displayName}</span>
        </span>
        {isFeatured ? (
          <span className="owner-info-row__featured">Featured</span>
        ) : null}
      </div>
    </div>
  );
}
