"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSellerPreferences, saveSellerPreferences } from "@/lib/api/buyerRequests";
import { getPropertyCategories } from "@/lib/api/client";
import type { CategoryNode } from "@/types/property";

function collectCategories(nodes: CategoryNode[], acc: CategoryNode[] = []): CategoryNode[] {
  nodes.forEach((n) => {
    acc.push(n);
    if (n.children?.length) collectCategories(n.children, acc);
  });
  return acc;
}

export default function SellerPreferencesPage() {
  const { user, loading: authLoading, openMainPath } = useAuth();
  const { openLogin } = useAuthModal();
  const [options, setOptions] = useState<CategoryNode[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    void getPropertyCategories()
      .then((tree) => {
        const mains =
          (tree as CategoryNode & { main_categories?: CategoryNode[] }).main_categories || [tree];
        setOptions(collectCategories(mains.filter(Boolean) as CategoryNode[]));
      })
      .catch(() => setOptions([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    void getSellerPreferences()
      .then((json) => {
        setVerified(Boolean(json?.meta?.is_corporate_verified));
        const cats = json?.data?.categories || [];
        setSelected(cats.map((c: { id: number }) => Number(c.id)));
        const loc = json?.data?.locations?.[0];
        if (loc?.city) setCity(loc.city);
        if (loc?.country) setCountry(loc.country);
      })
      .catch(() => undefined);
  }, [user]);

  const optionIds = useMemo(() => new Set(options.map((o) => Number(o.id))), [options]);

  if (authLoading) return <main className="container py-5">Loading…</main>;
  if (!user) {
    return (
      <main className="container py-5 text-center">
        <button type="button" className="btn btn-dark rounded-pill" onClick={openLogin}>
          Log in
        </button>
      </main>
    );
  }

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk("");
    try {
      await saveSellerPreferences({
        category_ids: selected.filter((id) => optionIds.has(id)),
        locations: city
          ? [{ city, country, location_label: [city, country].filter(Boolean).join(", ") }]
          : [],
      });
      setOk("Preferences saved.");
    } catch (err) {
      setError((err as Error).message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container py-4 py-md-5" style={{ maxWidth: 720 }}>
      <Link href="/seller/buyer-requests" className="small text-muted">
        ← Leads
      </Link>
      <h1 className="h3 mt-2 mb-3">Lead preferences</h1>
      {!verified ? (
        <div className="alert alert-warning">
          Corporate verification required.{" "}
          <button type="button" className="btn btn-link p-0" onClick={() => void openMainPath("/identity-verification")}>
            Verify
          </button>
        </div>
      ) : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {ok ? <div className="alert alert-success">{ok}</div> : null}
      <form onSubmit={onSave} className="bg-white border rounded-4 p-4">
        <p className="small text-muted">Choose property categories for match alerts.</p>
        <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 280, overflow: "auto" }}>
          {options.map((o) => (
            <label key={o.id} className="d-flex align-items-center gap-2 small">
              <input
                type="checkbox"
                checked={selected.includes(Number(o.id))}
                onChange={() => toggle(Number(o.id))}
              />
              {o.name}
            </label>
          ))}
        </div>
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input className="form-control" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-dark rounded-pill" disabled={busy || !verified}>
          {busy ? "Saving…" : "Save preferences"}
        </button>
      </form>
    </main>
  );
}
