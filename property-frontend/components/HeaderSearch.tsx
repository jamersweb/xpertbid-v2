"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PropertyCard } from "@/types/property";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
};

export function HeaderSearch({
  isOpen,
  onClose,
  placeholder = "Search any listing...",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setLoading(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (trimmed.length <= 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/properties?q=${encodeURIComponent(trimmed)}&per_page=8`,
          {
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Search failed");
        const json = (await res.json()) as { data?: PropertyCard[] };
        if (!controller.signal.aborted) {
          setResults(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/properties?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search listings">
      <div className="search-box">
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close search"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </form>

        {loading ? <p className="status">Searching...</p> : null}
        {!loading && query.trim().length > 2 && results.length === 0 ? (
          <p className="status">No results found</p>
        ) : null}
        {results.length > 0 ? (
          <ul className="results">
            {results.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  router.push(`/properties/${item.slug}`);
                  onClose();
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
