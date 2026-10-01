import Link from "next/link";

export default function NotFound() {
  return (
    <div className="property-browse-wrap py-5">
      <div className="container text-center">
        <h1 className="property-browse-title mb-3">Page not found</h1>
        <p className="text-muted mb-4">
          That property or page is unavailable. It may have been sold or removed.
        </p>
        <Link
          href="/properties"
          className="btn"
          style={{ background: "#23262F", color: "#fff", borderRadius: 8, padding: "12px 20px" }}
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}
