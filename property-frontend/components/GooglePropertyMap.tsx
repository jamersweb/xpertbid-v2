"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mapUrl?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  locationAddress?: string | null;
  title?: string;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function extractCoordinates(
  latProp?: number | string | null,
  lngProp?: number | string | null,
  url?: string | null
): { lat: number; lng: number } | null {
  if (latProp && lngProp) {
    const lat = Number(latProp);
    const lng = Number(lngProp);
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  if (!url || typeof url !== "string") return null;

  const matchAt = url.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i);
  if (matchAt) {
    const lat = Number.parseFloat(matchAt[1]);
    const lng = Number.parseFloat(matchAt[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng };
  }

  const matchQuery = url.match(/[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i);
  if (matchQuery) {
    const lat = Number.parseFloat(matchQuery[1]);
    const lng = Number.parseFloat(matchQuery[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng };
  }

  return null;
}

export function GooglePropertyMap({
  mapUrl,
  latitude,
  longitude,
  locationAddress,
  title = "Property Location",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const coords = extractCoordinates(latitude, longitude, mapUrl);

  useEffect(() => {
    if (!API_KEY) {
      setLoadError(true);
      return;
    }

    if (typeof window === "undefined") return;

    const checkMapsReady = () => {
      const g = (window as any).google;
      return Boolean(g && g.maps && typeof g.maps.Map === "function");
    };

    if (checkMapsReady()) {
      setIsLoaded(true);
      return;
    }

    const scriptId = "google-maps-frontend-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const onScriptLoad = () => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        if (checkMapsReady()) {
          clearInterval(interval);
          setIsLoaded(true);
        } else if (attempts > 30) {
          clearInterval(interval);
          setLoadError(true);
        }
      }, 100);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = onScriptLoad;
      script.onerror = () => setLoadError(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", onScriptLoad);
      onScriptLoad();
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current || !coords) return;

    try {
      const google = (window as any).google;
      if (!google || !google.maps || typeof google.maps.Map !== "function") {
        setLoadError(true);
        return;
      }

      const position = { lat: coords.lat, lng: coords.lng };

      const map = new google.maps.Map(containerRef.current, {
        center: position,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });
      mapRef.current = map;

      const marker = new google.maps.Marker({
        position,
        map,
        title,
        animation: google.maps.Animation ? google.maps.Animation.DROP : undefined,
      });

      if (locationAddress || title) {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 6px; font-family: system-ui, sans-serif;">
              <strong style="font-size: 14px; color: #111827;">${title}</strong>
              ${locationAddress ? `<p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">${locationAddress}</p>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    } catch (err) {
      console.error("Google Maps frontend render error:", err);
      setLoadError(true);
    }
  }, [isLoaded, coords, locationAddress, title]);

  if (!coords && !mapUrl) {
    return null;
  }

  const directGoogleMapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : mapUrl || "#";

  if (loadError || !API_KEY || !coords) {
    return (
      <div className="property-google-map-fallback mt-3 p-3 border rounded bg-light">
        {locationAddress ? (
          <p className="mb-2 text-dark small font-weight-bold">
            <i className="fa-solid fa-location-dot me-1 text-danger"></i> {locationAddress}
          </p>
        ) : null}
        {mapUrl ? (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
          >
            <i className="fa-solid fa-map-location-dot me-1"></i> View on Google Maps
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="property-google-map-container mt-3">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "360px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          background: "#f8fafc",
        }}
      />
      <div className="d-flex justify-content-between align-items-center mt-2 px-1">
        <span className="text-muted small">
          <i className="fa-solid fa-location-dot text-danger me-1"></i>
          {locationAddress || "Pinpointed property location"}
        </span>
        <a
          href={directGoogleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary small fw-semibold text-decoration-none"
        >
          Open in Google Maps <i className="fa-solid fa-arrow-up-right-from-square ms-1" style={{ fontSize: "0.75rem" }}></i>
        </a>
      </div>
    </div>
  );
}
