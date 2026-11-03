"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import BuyerRequestFormShell, {
  FieldLabel,
  FormCard,
} from "@/components/buyer-requests/BuyerRequestFormShell";
import FulfillmentLocationPicker from "@/components/buyer-requests/FulfillmentLocationPicker";
import { BrStyles } from "@/components/buyer-requests/BrUi";
import { createBuyerRequest } from "@/lib/api/buyerRequests";
import { getPropertyCategories } from "@/lib/api/client";
import type { CategoryNode } from "@/types/property";

const MAX_IMAGES = 8;

function flattenRoots(tree: CategoryNode | null): CategoryNode[] {
  if (!tree) return [];
  const mains = (tree as CategoryNode & { main_categories?: CategoryNode[] }).main_categories;
  if (Array.isArray(mains) && mains.length) return mains;
  return [tree];
}

export default function NewBuyerRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const [roots, setRoots] = useState<CategoryNode[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [subId, setSubId] = useState("");
  const [childId, setChildId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [locationLabel, setLocationLabel] = useState("");
  const [latitude, setLatitude] = useState<string | number>("");
  const [longitude, setLongitude] = useState<string | number>("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getPropertyCategories()
      .then((tree) => setRoots(flattenRoots(tree)))
      .catch(() => setRoots([]));
  }, []);

  const selectedRoot = useMemo(
    () => roots.find((r) => String(r.id) === categoryId) || null,
    [roots, categoryId]
  );
  const subs = useMemo(() => selectedRoot?.children || [], [selectedRoot]);
  const selectedSub = useMemo(
    () => subs.find((s) => String(s.id) === subId) || null,
    [subs, subId]
  );
  const children = selectedSub?.children || [];

  const previews = useMemo(
    () => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_IMAGES));
  };

  if (authLoading) {
    return (
      <div className="brf-page">
        <div className="brf-inner">Loading…</div>
        <BrStyles />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="brf-page">
        <div className="brf-inner">
          <div className="br-empty text-center" style={{ padding: "3rem 1.5rem" }}>
            <p className="mb-3">Log in to create a buyer request.</p>
            <button type="button" className="br-btn br-btn--dark" onClick={openLogin}>
              Log in
            </button>
          </div>
        </div>
        <BrStyles />
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("category_id", categoryId);
      if (subId) form.append("sub_category_id", subId);
      if (childId) form.append("child_category_id", childId);
      if (budget) form.append("budget", budget);
      if (locationLabel) form.append("location_label", locationLabel);
      if (city) form.append("city", city);
      if (stateName) form.append("state", stateName);
      if (country) form.append("country", country);
      if (latitude !== "" && latitude != null) form.append("latitude", String(latitude));
      if (longitude !== "" && longitude != null) form.append("longitude", String(longitude));
      files.forEach((file) => form.append("images[]", file));
      const json = await createBuyerRequest(form);
      const slug = json?.data?.slug || json?.slug;
      router.push(slug ? `/buyer-requests/${slug}` : "/buyer-requests");
    } catch (err) {
      setError((err as Error).message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="brf-inner" style={{ paddingBottom: 0 }}>
          <div className="br-alert br-alert--danger mb-0">{error}</div>
        </div>
      ) : null}
      <BuyerRequestFormShell
        title="New Request"
        submitting={busy}
        submitLabel="Create request"
        submittingLabel="Creating..."
        onSubmit={onSubmit}
      >
        <FormCard title="General info" description="Tell sellers exactly what you need.">
          <div className="brf-fields">
            <div>
              <FieldLabel required>Product name</FieldLabel>
              <input
                className="brf-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Full kitchen renovation"
                required
              />
            </div>
            <div>
              <FieldLabel required>Category</FieldLabel>
              <select
                className="brf-input"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubId("");
                  setChildId("");
                }}
                required
              >
                <option value="">Select category</option>
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            {subs.length > 0 ? (
              <div>
                <FieldLabel>Subcategory</FieldLabel>
                <select
                  className="brf-input"
                  value={subId}
                  onChange={(e) => {
                    setSubId(e.target.value);
                    setChildId("");
                  }}
                >
                  <option value="">Select subcategory</option>
                  {subs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {children.length > 0 ? (
              <div>
                <FieldLabel>Child category</FieldLabel>
                <select
                  className="brf-input"
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                >
                  <option value="">Select child category</option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                className="brf-input"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Size, quantity, condition, and other details..."
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Photos / reference images"
          description={`Upload up to ${MAX_IMAGES} images. Clear photos get faster offers.`}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            disabled={files.length >= MAX_IMAGES}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div
            role="button"
            tabIndex={0}
            className={`brf-drop ${dragOver ? "is-over" : ""} ${files.length >= MAX_IMAGES ? "is-full" : ""
              }`}
            onClick={() => {
              if (files.length >= MAX_IMAGES) return;
              fileInputRef.current?.click();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <div className="brf-drop__icon">
              <i className="fa-solid fa-cloud-arrow-up" aria-hidden />
            </div>
            <strong>
              {files.length >= MAX_IMAGES
                ? "Maximum images reached"
                : "Upload files or drag and drop"}
            </strong>
            <p>PNG, JPG, WEBP or GIF · max 10MB each · up to {MAX_IMAGES} images</p>
            <p style={{ fontWeight: 600, color: "#475569" }}>
              {files.length}/{MAX_IMAGES} attached
            </p>
          </div>
          {previews.length > 0 ? (
            <div className="brf-images">
              {previews.map((p, idx) => (
                <div key={p.url} className="brf-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </FormCard>

        <FormCard
          title="Budget & delivery preference"
          description="Help sellers match your price and location."
        >
          <div className="brf-fields">
            <div>
              <FieldLabel>Expected price / target budget</FieldLabel>
              <div className="brf-budget">
                <span>PKR</span>
                <input
                  className="brf-input"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 150000"
                />
              </div>
              <p className="brf-hint">
                Optional. Sellers can still offer above or below this amount.
              </p>
            </div>
            <FulfillmentLocationPicker
              value={locationLabel}
              latitude={latitude}
              longitude={longitude}
              onChange={(next) => {
                setLocationLabel(next.location_label || "");
                if (next.city != null) setCity(next.city);
                if (next.state != null) setStateName(next.state);
                if (next.country != null) setCountry(next.country);
                if (next.latitude != null) setLatitude(next.latitude);
                if (next.longitude != null) setLongitude(next.longitude);
              }}
            />
          </div>
        </FormCard>
      </BuyerRequestFormShell>
      <BrStyles />
    </>
  );
}
