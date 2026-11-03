"use client";

import { useEffect, useRef, useState } from "react";

export type LocationChange = {
  location_label: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: string | number;
  longitude?: string | number;
};

type Suggestion = {
  id: string;
  label: string;
  secondary?: string;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
};

type NominatimRow = {
  place_id?: number | string;
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlace = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat?: () => number;
      lng?: () => number;
    };
  };
};

type GooglePredictionItem = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

interface GooglePlacesServiceInstance {
  getDetails: (
    request: { placeId: string; fields?: string[] },
    callback: (place: GooglePlace | null, status: string) => void
  ) => void;
}

interface GoogleAutocompleteServiceInstance {
  getPlacePredictions: (
    request: { input: string; componentRestrictions?: { country: string | string[] } },
    callback: (predictions: GooglePredictionItem[] | null, status: string) => void
  ) => void;
}

interface CustomGoogleMapsGlobal {
  maps?: {
    places?: {
      AutocompleteService?: new () => GoogleAutocompleteServiceInstance;
      PlacesService?: new (attrContainer: HTMLDivElement) => GooglePlacesServiceInstance;
      PlacesServiceStatus: {
        OK: string;
      };
    };
  };
}

type Props = {
  value?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  onChange: (next: LocationChange) => void;
  error?: string;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function getGoogleMapsGlobal(): CustomGoogleMapsGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { google?: CustomGoogleMapsGlobal }).google;
}

function loadGooglePlaces(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const google = getGoogleMapsGlobal();
  if (google?.maps?.places) return Promise.resolve();
  if (!API_KEY) return Promise.reject(new Error("no-key"));

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-xb-places]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.dataset.xbPlaces = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script"));
    document.head.appendChild(script);
  });
}

async function reverseGeocode(lat: number, lng: number): Promise<LocationChange> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || "";
      const state = data.principalSubdivision || "";
      const country = data.countryName || "";
      const area =
        data.localityInfo?.informative?.find((i: { description?: string; name?: string }) =>
          /neighbourhood|neighborhood|suburb|colony|area/i.test(i.description || i.name || "")
        )?.name || "";
      const location_label = [area && area !== city ? area : null, city, state, country]
        .filter(Boolean)
        .join(", ");
      if (location_label) {
        return { location_label, city, state, country, latitude: lat, longitude: lng };
      }
    }
  } catch {
    // try nominatim
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
      const state = data.address?.state || "";
      const country = data.address?.country || "";
      const location_label =
        data.display_name || [city, state, country].filter(Boolean).join(", ") || "Current location";
      return { location_label, city, state, country, latitude: lat, longitude: lng };
    }
  } catch {
    // fall through
  }

  return {
    location_label: "Current location",
    latitude: lat,
    longitude: lng,
  };
}

async function searchNominatim(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) return [];
    const rows = (await res.json()) as NominatimRow[];
    return (rows || []).map((row, idx) => {
      const city = row.address?.city || row.address?.town || row.address?.village || "";
      const state = row.address?.state || "";
      const country = row.address?.country || "";
      return {
        id: String(row.place_id || idx),
        label: row.display_name || [city, state, country].filter(Boolean).join(", "),
        secondary: [city, state, country].filter(Boolean).join(", "),
        lat: row.lat ? Number(row.lat) : undefined,
        lng: row.lon ? Number(row.lon) : undefined,
        city,
        state,
        country,
      };
    });
  }

export default function FulfillmentLocationPicker({
    value = "",
    latitude,
    longitude,
    onChange,
    error,
  }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const placesSvcRef = useRef<GooglePlacesServiceInstance | null>(null);
    const autocompleteSvcRef = useRef<GoogleAutocompleteServiceInstance | null>(null);
    const [address, setAddress] = useState(value || "");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [open, setOpen] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locateStatus, setLocateStatus] = useState("");
    const [geoError, setGeoError] = useState("");
    const [googleReady, setGoogleReady] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      setAddress(value || "");
    }, [value]);

    useEffect(() => {
      let cancelled = false;
      loadGooglePlaces()
        .then(() => {
          if (cancelled) return;
            const g = getGoogleMapsGlobal();
            if (g?.maps?.places?.AutocompleteService && g.maps.places.PlacesService) {
              autocompleteSvcRef.current = new g.maps.places.AutocompleteService();
              const div = document.createElement("div");
              placesSvcRef.current = new g.maps.places.PlacesService(div);
              setGoogleReady(true);
            }
          })
        .catch(() => setGoogleReady(false));
      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const emit = (next: LocationChange) => {
      setAddress(next.location_label);
      onChange(next);
    };

    const fetchSuggestions = (q: string) => {
      const query = q.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggest(true);

      if (googleReady && autocompleteSvcRef.current) {
        autocompleteSvcRef.current.getPlacePredictions(
          { input: query, componentRestrictions: { country: ["pk"] } },
            (preds, status) => {
              setLoadingSuggest(false);
                const g = getGoogleMapsGlobal();
                if (status !== g?.maps?.places?.PlacesServiceStatus.OK || !preds?.length) {
                  void searchNominatim(query).then((rows) => {
                    setSuggestions(rows);
                    setOpen(true);
                  });
                  return;
                }
                setSuggestions(
                  preds.map((p) => ({
                    id: p.place_id,
                    label: p.structured_formatting?.main_text || p.description,
                    secondary: p.structured_formatting?.secondary_text || "",
                  }))
                );
                setOpen(true);
              }
      );
        return;
      }

      void searchNominatim(query)
        .then((rows) => {
          setSuggestions(rows);
          setOpen(true);
        })
        .finally(() => setLoadingSuggest(false));
    };

    const onInput = (raw: string) => {
      setAddress(raw);
      setGeoError("");
      onChange({
        location_label: raw,
        latitude: latitude ?? "",
        longitude: longitude ?? "",
      });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(raw), 280);
    };

    const selectSuggestion = (item: Suggestion) => {
      setOpen(false);
      if (item.id && placesSvcRef.current && googleReady) {
        placesSvcRef.current.getDetails(
          { placeId: item.id, fields: ["formatted_address", "geometry", "address_component"] },
              (place, status) => {
                const g = getGoogleMapsGlobal();
                if (status === g?.maps?.places?.PlacesServiceStatus.OK && place) {
                  const comps = place.address_components || [];
                  const pick = (...types: string[]) =>
                  comps.find((c) => types.some((t) => (c.types || []).includes(t)))?.long_name || "";
                  const city = pick("locality", "postal_town") || pick("administrative_area_level_2");
                  const state = pick("administrative_area_level_1");
                  const country = pick("country");
                  const lat = place.geometry?.location?.lat?.();
                  const lng = place.geometry?.location?.lng?.();
                  emit({
                    location_label: place.formatted_address || item.label,
                    city,
                    state,
                    country,
                    latitude: lat ?? "",
                    longitude: lng ?? "",
                  });
                  return;
                }
                emit({
                  location_label: item.label,
                  city: item.city,
                  state: item.state,
                  country: item.country,
                  latitude: item.lat ?? "",
                  longitude: item.lng ?? "",
                });
              }
      );
        return;
      }

      emit({
        location_label: item.label,
        city: item.city,
        state: item.state,
        country: item.country,
        latitude: item.lat ?? "",
        longitude: item.lng ?? "",
      });
    };

      const handleUseCurrentLocation = async () => {
        setGeoError("");
        setOpen(false);
        setLocating(true);
        setLocateStatus("Getting your GPS location…");
        try {
          if (!navigator.geolocation) throw new Error("unsupported");
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 12000,
              maximumAge: 60000,
            });
          });
          setLocateStatus("Finding your area & address…");
          const resolved = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          emit(resolved);
        } catch {
          setGeoError(
            "Could not detect location automatically. Please type your area (e.g. DHA, Karachi) in the box."
          );
        } finally {
          setLocateStatus("");
          setLocating(false);
        }
      };

      return (
        <div className="brf-loc" ref={wrapRef}>
          <div className="brf-loc__head">
            <label className="brf-label mb-0">
              Fulfillment location
            </label>
            <button
              type="button"
              className="brf-loc__gps"
              onClick={() => void handleUseCurrentLocation()}
              disabled={locating}
            >
              <i className={`fa-solid ${locating ? "fa-spinner fa-spin" : "fa-location-crosshairs"}`} aria-hidden />
              {locating ? "Locating..." : "Use Current Location"}
            </button>
          </div>

          {geoError ? <p className="brf-loc__warn">{geoError}</p> : null}

          <div className="brf-loc__input-wrap">
            <input
              className="brf-input"
              type="text"
              value={locating ? locateStatus || "Getting your location…" : address}
              onChange={(e) => onInput(e.target.value)}
              onFocus={() => {
                if (!locating && suggestions.length) setOpen(true);
                else if (!locating && address.trim().length >= 2) fetchSuggestions(address);
              }}
              placeholder="Search city, area or address..."
              disabled={locating}
              autoComplete="off"
            />
            <i
              className={`fa-solid ${loadingSuggest || locating ? "fa-spinner fa-spin" : "fa-magnifying-glass"} brf-loc__icon`}
              aria-hidden
            />
            {open && suggestions.length > 0 ? (
              <ul className="brf-loc__list">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => selectSuggestion(s)}>
                      <strong>{s.label}</strong>
                      {s.secondary ? <span>{s.secondary}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {error ? <p className="brf-error">{error}</p> : null}
          <p className="brf-hint">
            <i className="fa-solid fa-circle-info me-1" aria-hidden />
            Search an address or use current location so sellers nearby can offer.
          </p>

          <style>{`
        .brf-loc__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }
        .brf-loc__gps {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 0.65rem;
          padding: 0.45rem 0.75rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
        }
        .brf-loc__gps:hover { background: #f8fafc; }
        .brf-loc__gps:disabled { opacity: 0.7; cursor: wait; }
        .brf-loc__warn {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
          color: #b45309;
        }
        .brf-loc__input-wrap { position: relative; }
        .brf-loc__icon {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .brf-loc__input-wrap .brf-input { padding-right: 2.4rem; }
        .brf-loc__list {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 4px);
          z-index: 40;
          margin: 0;
          padding: 0;
          list-style: none;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
          max-height: 260px;
          overflow-y: auto;
        }
        .brf-loc__list button {
          width: 100%;
          border: 0;
          background: transparent;
          text-align: left;
          padding: 0.55rem 0.85rem;
          cursor: pointer;
        }
        .brf-loc__list button:hover { background: #f8fafc; }
        .brf-loc__list strong {
          display: block;
          font-size: 0.875rem;
          color: #0f172a;
          font-weight: 600;
        }
        .brf-loc__list span {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>
        </div>
      );
    }
