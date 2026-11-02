import { resolveProfileImageSrc } from "@/components/auth/AuthProvider";
import type { BuyerRequestItem, PublicIdentity } from "@/lib/api/buyerRequests";

export function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Public buyer-request location: city + country only (never exact address / coords). */
export function publicBuyerRequestLocation(item?: {
  city?: string | null;
  country?: string | null;
} | null) {
  if (!item) return "";
  const rawCity = String(item.city || "").trim();
  const cityParts = rawCity
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const city = cityParts.length > 1 ? cityParts[cityParts.length - 1] : rawCity;
  const country = String(item.country || "").trim();
  return [city, country].filter(Boolean).join(", ");
}

export function isPublicIdentityVerified(person?: PublicIdentity | null) {
  if (!person) return false;
  if (person.is_verified) return true;
  return Boolean(person.verification_type);
}

export function publicIdentityLabel(
  person?: PublicIdentity | null,
  role: "buyer" | "seller" = "buyer"
) {
  const type = person?.verification_type || "individual";
  if (role === "buyer") {
    return type === "corporate" ? "Verified business" : "Verified buyer";
  }
  return type === "corporate" ? "Verified business" : "Verified seller";
}

/** Desktop header PFP resolution (main-site absolute URL). */
export function publicIdentityAvatarSrc(person?: PublicIdentity | null) {
  return resolveProfileImageSrc(person?.profile_pic || person?.profile);
}

export function VerifiedBadge({ title }: { title: string }) {
  return (
    <span className="br-verified" title={title} aria-label={title}>
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="#2F80ED" />
        <path
          d="M6.8 10.2L8.9 12.3L13.3 7.9"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PublicIdentityRow({
  person,
  role = "buyer",
  size = "md",
}: {
  person?: PublicIdentity | null;
  role?: "buyer" | "seller";
  size?: "sm" | "md";
}) {
  if (!person) return null;
  const verified = isPublicIdentityVerified(person);
  const label = publicIdentityLabel(person, role);
  const fallback = role === "buyer" ? "Buyer" : "Seller";

  return (
    <div className={`br-identity br-identity--${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={publicIdentityAvatarSrc(person)}
        alt={person.name || fallback}
        className="br-identity__avatar"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/assets/images/user.jpg";
        }}
      />
      <div className="br-identity__meta">
        <div className="br-identity__name-row">
          <span className="br-identity__name">{person.name || fallback}</span>
          {verified ? <VerifiedBadge title={label} /> : null}
        </div>
        {verified && size === "md" ? <div className="br-identity__badge">{label}</div> : null}
      </div>
    </div>
  );
}

export function formatPostedDate(value?: string) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function statusPill(status: string) {
  const map: Record<string, { bg: string; color: string; ring: string }> = {
    open: { bg: "#ecfdf5", color: "#047857", ring: "#a7f3d0" },
    closed: { bg: "#f1f5f9", color: "#475569", ring: "#e2e8f0" },
    fulfilled: { bg: "#f0f9ff", color: "#0369a1", ring: "#bae6fd" },
  };
  return map[status] || map.closed;
}

export function categoryLine(item: BuyerRequestItem) {
  return (
    [item.category?.name, item.sub_category?.name, item.child_category?.name]
      .filter(Boolean)
      .join(" › ") || "Uncategorized"
  );
}

export function BrStyles() {
  return (
    <style>{`
      .br-page {
        min-height: 70vh;
        background: #f7f7f5;
        padding-bottom: 5rem;
      }
      .br-page__inner {
        max-width: 80rem;
        margin: 0 auto;
        padding: 1.5rem 1rem;
      }
      @media (min-width: 576px) {
        .br-page__inner { padding: 2rem 1.5rem; }
      }
      .br-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        flex-wrap: wrap;
      }
      .br-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0f172a;
      }
      @media (min-width: 576px) {
        .br-title { font-size: 1.5rem; }
      }
      .br-sub {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: #475569;
      }
      .br-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        border-radius: 0.75rem;
        padding: 0.65rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none !important;
        border: 0;
        cursor: pointer;
        transition: background 0.15s ease;
        white-space: nowrap;
      }
      .br-btn--dark {
        background: #0f172a;
        color: #fff !important;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
      }
      .br-btn--dark:hover { background: #000; color: #fff !important; }
      .br-btn--outline {
        background: #fff;
        color: #334155 !important;
        border: 1px solid #e2e8f0;
      }
      .br-btn--outline:hover { background: #f8fafc; }
      .br-btn--sky {
        background: #43ACE9;
        color: #fff !important;
        box-shadow: 0 10px 28px rgba(67, 172, 233, 0.35);
      }
      .br-btn--sky:hover { background: #35a0df; color: #fff !important; }
      .br-filters {
        margin-bottom: 1.5rem;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.7);
        background: rgba(255, 255, 255, 0.9);
        padding: 0.75rem;
        box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      }
      @media (min-width: 576px) {
        .br-filters { padding: 1rem; margin-bottom: 2rem; }
      }
      .br-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.25rem;
        border-radius: 0.75rem;
        background: rgba(241, 245, 249, 0.8);
        padding: 0.25rem;
      }
      @media (min-width: 576px) {
        .br-tabs { display: flex; flex-wrap: wrap; }
      }
      .br-tab {
        display: inline-flex;
        min-width: 0;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        border: 0;
        border-radius: 0.5rem;
        padding: 0.5rem 0.65rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #475569;
        background: transparent;
        cursor: pointer;
      }
      @media (min-width: 576px) {
        .br-tab {
          justify-content: flex-start;
          font-size: 0.875rem;
          padding: 0.5rem 0.875rem;
        }
      }
      .br-tab.is-active {
        background: #0f172a;
        color: #fff;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
      }
      .br-tab__count {
        display: inline-flex;
        min-width: 1.25rem;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 0.1rem 0.4rem;
        font-size: 0.7rem;
        font-weight: 600;
        background: #fff;
        color: #475569;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
      }
      .br-tab__count.is-active {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        box-shadow: none;
      }
      .br-filters__row {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #f1f5f9;
      }
      @media (min-width: 576px) {
        .br-filters__row { flex-direction: row; align-items: center; }
      }
      .br-search { position: relative; flex: 1; min-width: 0; }
      .br-search i {
        position: absolute;
        left: 0.9rem;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 0.85rem;
        pointer-events: none;
      }
      .br-search input,
      .br-select select {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        padding: 0.65rem 0.9rem;
        font-size: 0.875rem;
        color: #0f172a;
        outline: none;
      }
      .br-search input { padding-left: 2.4rem; }
      .br-search input:focus,
      .br-select select:focus {
        border-color: #94a3b8;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
      }
      .br-selects { display: flex; gap: 0.65rem; width: 100%; }
      @media (min-width: 576px) {
        .br-selects { width: auto; flex-shrink: 0; }
        .br-select { width: 10.5rem; }
      }
      .br-select { position: relative; flex: 1; min-width: 0; }
      .br-select select {
        appearance: none;
        padding-right: 2rem;
        font-weight: 500;
        color: #334155;
      }
      .br-select::after {
        content: "▾";
        position: absolute;
        right: 0.7rem;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 0.75rem;
        pointer-events: none;
      }
      .br-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      @media (min-width: 768px) {
        .br-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      }
      @media (min-width: 992px) {
        .br-grid { grid-template-columns: 1fr 1fr 1fr; }
      }
      .br-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 1rem;
        border: 1px solid rgba(226, 232, 240, 0.7);
        background: #fff;
        padding: 0.9rem;
        box-shadow: 0 8px 28px rgba(15, 23, 42, 0.07);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      @media (min-width: 576px) {
        .br-card { padding: 1rem; }
      }
      .br-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 40px rgba(15, 23, 42, 0.11);
      }
      .br-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.15rem 0.65rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .br-pill--muted { background: #f1f5f9; color: #334155; }
      .br-pill--open {
        background: #ecfdf5;
        color: #047857;
        box-shadow: inset 0 0 0 1px #a7f3d0;
      }
      .br-pill--amber {
        background: #fffbeb;
        color: #b45309;
        box-shadow: inset 0 0 0 1px #fde68a;
      }
      .br-identity {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-top: 0.75rem;
      }
      .br-identity--sm { gap: 0.5rem; margin-top: 0.65rem; }
      .br-identity__avatar {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        object-fit: cover;
        border: 1px solid #e2e8f0;
        background: #f1f5f9;
        flex-shrink: 0;
      }
      .br-identity--sm .br-identity__avatar {
        width: 1.75rem;
        height: 1.75rem;
      }
      .br-identity__meta { min-width: 0; }
      .br-identity__name-row {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        min-width: 0;
      }
      .br-identity__name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0f172a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .br-identity--sm .br-identity__name { font-size: 0.75rem; }
      .br-identity__badge {
        margin-top: 0.1rem;
        font-size: 0.6875rem;
        font-weight: 600;
        color: #0284c7;
      }
      .br-verified {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
      }
      .br-verified svg {
        width: 1rem;
        height: 1rem;
      }
      .br-identity--sm .br-verified svg {
        width: 0.875rem;
        height: 0.875rem;
      }
      .br-card__title {
        margin: 0.75rem 0 0;
        font-size: 1.125rem;
        font-weight: 700;
        color: #111827;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .br-meta {
        margin-top: 0.65rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-size: 0.75rem;
        color: #64748b;
      }
      .br-meta__row {
        display: flex;
        align-items: flex-start;
        gap: 0.4rem;
        min-width: 0;
      }
      .br-meta__row i {
        margin-top: 0.1rem;
        color: #0ea5e9;
        width: 0.9rem;
        text-align: center;
        flex-shrink: 0;
      }
      .br-meta__row span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .br-meta__row--strong { font-weight: 600; color: #1e293b; }
      .br-meta__row--strong i { color: #10b981; }
      .br-card__desc {
        margin: 0.75rem 0 0;
        font-size: 0.875rem;
        line-height: 1.5;
        color: #475569;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .br-thumbs { margin-top: 0.75rem; display: flex; gap: 0.5rem; }
      .br-thumb {
        position: relative;
        width: 3.5rem;
        height: 3.5rem;
        overflow: hidden;
        border-radius: 0.5rem;
        border: 1px solid #f1f5f9;
        background: #f1f5f9;
      }
      .br-thumb img { width: 100%; height: 100%; object-fit: cover; }
      .br-thumb__more {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
      }
      .br-card__footer {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
      }
      .br-card__footer.is-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      .br-empty {
        border-radius: 1rem;
        border: 1px dashed rgba(203, 213, 225, 0.9);
        background: rgba(255, 255, 255, 0.9);
        padding: 3.5rem 1.5rem;
        box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      }
      .br-empty__icon { font-size: 2.25rem; color: #cbd5e1; }
      .br-empty__title {
        margin: 0.75rem 0 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #111827;
      }
      .br-empty__text {
        margin: 0.35rem auto 0;
        max-width: 28rem;
        font-size: 0.875rem;
        color: #64748b;
      }
      .br-alert {
        border-radius: 1rem;
        padding: 1rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }
      .br-alert--warn {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #92400e;
      }
      .br-alert--danger {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
      }
      .br-link {
        background: none;
        border: 0;
        padding: 0;
        color: inherit;
        font-weight: 700;
        text-decoration: underline;
        cursor: pointer;
      }
    `}</style>
  );
}
