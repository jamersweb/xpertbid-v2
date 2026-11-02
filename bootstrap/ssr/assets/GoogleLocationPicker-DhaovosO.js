import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback } from "react";
function componentName(components, types) {
  const match = (components || []).find(
    (c) => (types || []).some((type) => (c.types || []).includes(type))
  );
  return match?.long_name || "";
}
function parseGooglePlaceResult(result) {
  const components = result?.address_components || [];
  const area = componentName(components, ["neighborhood", "sublocality_level_1", "sublocality", "sublocality_level_2"]) || componentName(components, ["premise", "route"]);
  const city = componentName(components, ["locality", "postal_town"]) || componentName(components, ["administrative_area_level_2"]);
  const state = componentName(components, ["administrative_area_level_1"]);
  const country = componentName(components, ["country"]);
  const postal = componentName(components, ["postal_code"]);
  const detailedParts = [
    componentName(components, ["street_number"]),
    componentName(components, ["route"]),
    area,
    city,
    state,
    postal,
    country
  ].filter(Boolean);
  const uniqueParts = [...new Set(detailedParts)];
  const location_label = uniqueParts.length >= 2 ? uniqueParts.join(", ") : result?.formatted_address || uniqueParts.join(", ") || "";
  return {
    location_label,
    area: area || "",
    city: city || "",
    state: state || "",
    country: country || ""
  };
}
function parseBigDataCloudResult(data) {
  const admin = data?.localityInfo?.administrative || [];
  const informative = data?.localityInfo?.informative || [];
  const pickAdmin = (order) => admin.find((a) => Number(a.adminLevel) === order)?.name || "";
  const neighbourhood = informative.find((i) => /neighbourhood|neighborhood|suburb|colony|area/i.test(i.description || i.name || ""))?.name || "";
  const area = neighbourhood || data?.locality || pickAdmin(8) || pickAdmin(7) || "";
  const city = data?.city || data?.locality || pickAdmin(6) || pickAdmin(5) || "";
  const state = data?.principalSubdivision || pickAdmin(4) || "";
  const country = data?.countryName || "";
  const location_label = [
    area && area !== city ? area : null,
    city,
    state,
    country
  ].filter(Boolean).join(", ");
  return {
    // Never fall back to raw coordinates — caller handles empty labels
    location_label,
    area: area || "",
    city: city || "",
    state: state || "",
    country: country || ""
  };
}
function looksLikeLatLng(value) {
  return /^-?\d{1,3}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?$/.test(String(value || "").trim());
}
async function reverseGeocodeNominatim(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) return null;
  const row = await res.json();
  if (!row || row.error) return null;
  const a = row.address || {};
  const area = a.neighbourhood || a.suburb || a.quarter || a.residential || a.road || "";
  const city = a.city || a.town || a.village || a.municipality || a.county || "";
  const state = a.state || a.region || "";
  const country = a.country || "";
  const label = row.display_name || [area, city, state, country].filter(Boolean).join(", ");
  if (!label || looksLikeLatLng(label)) return null;
  return {
    location_label: label,
    area,
    city,
    state,
    country
  };
}
async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) return [];
  const rows = await res.json();
  return (rows || []).map((row) => {
    const a = row.address || {};
    const area = a.neighbourhood || a.suburb || a.quarter || a.residential || a.road || "";
    const city = a.city || a.town || a.village || a.municipality || a.county || "";
    const state = a.state || a.region || "";
    const country = a.country || "";
    const label = row.display_name || [area, city, state, country].filter(Boolean).join(", ");
    return {
      id: String(row.place_id),
      label,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lon),
      area,
      city,
      state,
      country
    };
  });
}
function GoogleLocationPicker({
  addressValue = "",
  latitudeValue = "",
  longitudeValue = "",
  onChange,
  error = "",
  label = "Property Location on Map",
  fallbackLabel = "Property Address",
  placeholder = "Search address or location on Google Maps...",
  fallbackPlaceholder = "Please enter property address",
  helperText = "Search an address above or drag/click the map pin to pin-point the exact location of your property.",
  required = true
}) {
  const mapContainerRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  useRef(null);
  const suggestTimerRef = useRef(null);
  const wrapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(addressValue);
  const [geoError, setGeoError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locateStatus, setLocateStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const displayLabel = isLoaded ? label : fallbackLabel;
  const displayPlaceholder = isLoaded ? placeholder : fallbackPlaceholder;
  useEffect(() => {
    setCurrentAddress(addressValue || "");
  }, [addressValue]);
  useEffect(() => {
    const lat = Number(latitudeValue);
    const lng = Number(longitudeValue);
    if (!looksLikeLatLng(addressValue)) return void 0;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return void 0;
    let cancelled = false;
    (async () => {
      try {
        const nom = await reverseGeocodeNominatim(lat, lng);
        if (cancelled || !nom?.location_label) return;
        setCurrentAddress(nom.location_label);
        updateParent({
          address: nom.location_label,
          lat,
          lng,
          area: nom.area || "",
          city: nom.city || "",
          state: nom.state || "",
          country: nom.country || ""
        });
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addressValue, latitudeValue, longitudeValue]);
  const updateParent = useCallback(({ address, lat, lng, area, city, state, country, location_label } = {}) => {
    const finalAddress = address !== void 0 ? address : location_label || currentAddress;
    const finalLat = lat !== void 0 ? lat : latitudeValue;
    const finalLng = lng !== void 0 ? lng : longitudeValue;
    const mapUrl = finalLat && finalLng ? `https://maps.google.com/maps?q=${finalLat},${finalLng}` : "";
    if (onChange) {
      onChange({
        property_address: finalAddress,
        location_label: finalAddress,
        latitude: finalLat,
        longitude: finalLng,
        map_url: mapUrl,
        area: area || "",
        city: city || "",
        state: state || "",
        country: country || ""
      });
    }
  }, [onChange, currentAddress, latitudeValue, longitudeValue]);
  useEffect(() => {
    return;
  }, []);
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;
    if (!window.google?.maps?.Map) return;
    try {
      const google = window.google;
      const defaultLat = parseFloat(latitudeValue) || 24.8607;
      const defaultLng = parseFloat(longitudeValue) || 67.0011;
      const defaultPos = { lat: defaultLat, lng: defaultLng };
      const map = new google.maps.Map(mapContainerRef.current, {
        center: defaultPos,
        zoom: latitudeValue && longitudeValue ? 16 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });
      mapRef.current = map;
      const marker = new google.maps.Marker({
        position: defaultPos,
        map,
        draggable: true,
        animation: google.maps.Animation ? google.maps.Animation.DROP : void 0,
        title: "Selected Location"
      });
      markerRef.current = marker;
      setMapReady(true);
      const geocodePosition = (pos) => {
        if (!google.maps.Geocoder) return;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const parsed = parseGooglePlaceResult(results[0]);
            const formattedAddress = parsed.location_label || results[0].formatted_address;
            setCurrentAddress(formattedAddress);
            updateParent({
              address: formattedAddress,
              lat: pos.lat,
              lng: pos.lng,
              ...parsed
            });
          } else {
            updateParent({ lat: pos.lat, lng: pos.lng });
          }
        });
      };
      marker.addListener("dragend", () => {
        const newPos = marker.getPosition();
        if (!newPos) return;
        geocodePosition({ lat: newPos.lat(), lng: newPos.lng() });
      });
      map.addListener("click", (e) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        geocodePosition({ lat, lng });
      });
      return () => {
        try {
          if (markerRef.current) {
            window.google?.maps?.event?.clearInstanceListeners?.(markerRef.current);
            markerRef.current.setMap(null);
            markerRef.current = null;
          }
          if (mapRef.current) {
            window.google?.maps?.event?.clearInstanceListeners?.(mapRef.current);
            mapRef.current = null;
          }
        } catch {
        }
        setMapReady(false);
      };
    } catch (err) {
      console.error("Google Maps initialization error:", err);
    }
  }, [isLoaded, latitudeValue, longitudeValue, updateParent]);
  const moveMapTo = (lat, lng) => {
    if (mapRef.current && markerRef.current && lat && lng) {
      const pos = { lat: Number(lat), lng: Number(lng) };
      mapRef.current.setCenter(pos);
      mapRef.current.setZoom(17);
      markerRef.current.setPosition(pos);
    }
  };
  const fetchSuggestions = useCallback(async (query) => {
    const q = String(query || "").trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestLoading(true);
    try {
      if (autocompleteServiceRef.current) {
        await new Promise((resolve) => {
          autocompleteServiceRef.current.getPlacePredictions(
            {
              input: q,
              types: ["geocode", "establishment"]
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && Array.isArray(predictions)) {
                setSuggestions(
                  predictions.slice(0, 6).map((p) => ({
                    id: p.place_id,
                    label: p.description,
                    placeId: p.place_id,
                    secondary: p.structured_formatting?.secondary_text || ""
                  }))
                );
              } else {
                setSuggestions([]);
              }
              resolve();
            }
          );
        });
      } else {
        const rows = await searchNominatim(q);
        setSuggestions(rows);
      }
    } catch (e) {
      console.warn("Suggestion search failed", e);
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  }, []);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setCurrentAddress(val);
    setGeoError("");
    updateParent({ address: val });
    setShowSuggestions(true);
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    suggestTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 280);
  };
  const selectSuggestion = async (item) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setGeoError("");
    if (item.placeId && placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: item.placeId,
          fields: ["formatted_address", "geometry", "address_components", "name"]
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const parsed = parseGooglePlaceResult(place);
            const formattedAddress = parsed.location_label || place.formatted_address || item.label;
            setCurrentAddress(formattedAddress);
            moveMapTo(lat, lng);
            updateParent({
              address: formattedAddress,
              lat,
              lng,
              ...parsed
            });
            return;
          }
          setCurrentAddress(item.label);
          updateParent({ address: item.label });
        }
      );
      return;
    }
    setCurrentAddress(item.label);
    moveMapTo(item.lat, item.lng);
    updateParent({
      address: item.label,
      lat: item.lat,
      lng: item.lng,
      area: item.area || "",
      city: item.city || "",
      state: item.state || "",
      country: item.country || ""
    });
  };
  const applyResolvedAddress = (formattedAddress, lat, lng, parsed = {}) => {
    setCurrentAddress(formattedAddress);
    updateParent({
      address: formattedAddress,
      lat,
      lng,
      area: parsed.area || "",
      city: parsed.city || "",
      state: parsed.state || "",
      country: parsed.country || "",
      location_label: formattedAddress
    });
  };
  const applyCurrentPosition = async (lat, lng) => {
    moveMapTo(lat, lng);
    if (window.google?.maps?.Geocoder) {
      const googleResolved = await new Promise((resolve) => {
        try {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const parsed = parseGooglePlaceResult(results[0]);
              const formattedAddress = parsed.location_label || results[0].formatted_address || "";
              if (formattedAddress && !looksLikeLatLng(formattedAddress)) {
                resolve({ formattedAddress, parsed });
                return;
              }
            }
            resolve(null);
          });
        } catch {
          resolve(null);
        }
      });
      if (googleResolved) {
        applyResolvedAddress(
          googleResolved.formattedAddress,
          lat,
          lng,
          googleResolved.parsed
        );
        return;
      }
    }
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const parsed = parseBigDataCloudResult(data);
        const partsLabel = [parsed.area, parsed.city, parsed.state, parsed.country].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(", ");
        const formattedAddress = parsed.location_label || partsLabel;
        if (formattedAddress && !looksLikeLatLng(formattedAddress)) {
          applyResolvedAddress(formattedAddress, lat, lng, parsed);
          return;
        }
      }
    } catch {
    }
    try {
      const nom = await reverseGeocodeNominatim(lat, lng);
      if (nom?.location_label) {
        applyResolvedAddress(nom.location_label, lat, lng, nom);
        return;
      }
    } catch {
    }
    applyResolvedAddress("Current location", lat, lng);
    setGeoError("Could not resolve a street address. Search your area to refine the pin.");
  };
  const getPositionAsync = (options) => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
  const FRIENDLY_AUTO_LOCATION_ERROR = "Could not detect location automatically. Please type your area (e.g. DHA, Karachi) in the box.";
  const messageForGeoError = (err) => {
    const code = Number(err?.code);
    if (code === 1) {
      return "Could not access GPS. Please turn on device Location / Location Services, then try again. You can also type your area in the box.";
    }
    if (code === 2) {
      return "Unable to determine your location right now. Please search your area manually.";
    }
    if (code === 3) {
      return "Location request timed out. Please try again or search manually.";
    }
    return FRIENDLY_AUTO_LOCATION_ERROR;
  };
  const normalizeIpGeo = (raw, source = "unknown") => {
    if (!raw || typeof raw !== "object") return null;
    if (raw.error || raw.source === "none") return null;
    const city = String(raw.city || "").trim();
    const state = String(
      raw.state || raw.region || raw.regionName || raw.principalSubdivision || ""
    ).trim();
    const country = String(
      raw.country_name || raw.country || raw.countryName || ""
    ).trim();
    const latRaw = raw.latitude ?? raw.lat;
    const lngRaw = raw.longitude ?? raw.lng ?? raw.lon;
    const lat = latRaw != null && latRaw !== "" ? Number(latRaw) : null;
    const lng = lngRaw != null && lngRaw !== "" ? Number(lngRaw) : null;
    const hasCoords = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);
    if (!city && !state && !country && !hasCoords) return null;
    return {
      city,
      state,
      country,
      latitude: hasCoords ? lat : null,
      longitude: hasCoords ? lng : null,
      source
    };
  };
  const isUsableIpGeo = (geo) => !!(geo && (geo.city || geo.state || geo.country || geo.latitude != null && geo.longitude != null));
  const fetchServerIpGeo = async () => {
    try {
      const response = await fetch("/detect-location-ip", {
        headers: { Accept: "application/json" },
        credentials: "same-origin"
      });
      if (!response.ok) return null;
      const data = await response.json();
      return normalizeIpGeo(data, data?.source || "server");
    } catch {
      return null;
    }
  };
  const fetchClientIpGeo = async () => {
    const endpoints = [
      { url: "https://get.geojs.io/v1/ip/geo.json", source: "geojs" },
      { url: "https://ipwho.is/", source: "ipwhois" },
      { url: "https://ipapi.co/json/", source: "ipapi" },
      {
        url: "https://api.bigdatacloud.net/data/ip-geolocation-client?localityLanguage=en",
        source: "bigdatacloud"
      }
    ];
    for (const { url, source } of endpoints) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) continue;
        const data = await res.json();
        if (data?.success === false) continue;
        const normalized = normalizeIpGeo(data, source);
        if (normalized) return normalized;
      } catch {
      }
    }
    return null;
  };
  const applyIpFallbackLocation = async () => {
    setLocateStatus("Detecting location from network…");
    const requireGeo = (promise) => promise.then((geo) => {
      if (!isUsableIpGeo(geo)) {
        return Promise.reject(new Error("empty"));
      }
      return geo;
    });
    let data = null;
    try {
      data = await Promise.any([
        requireGeo(fetchServerIpGeo()),
        requireGeo(fetchClientIpGeo())
      ]);
    } catch {
      data = null;
    }
    if (!isUsableIpGeo(data)) {
      throw new Error("AUTO_LOCATION_UNAVAILABLE");
    }
    const city = data.city || "";
    const state = data.state || "";
    const country = data.country || "";
    const lat = data.latitude;
    const lng = data.longitude;
    const label2 = [city, state, country].filter(Boolean).join(", ");
    if (!label2 && (lat == null || lng == null)) {
      throw new Error("AUTO_LOCATION_UNAVAILABLE");
    }
    if (!label2) {
      throw new Error("AUTO_LOCATION_UNAVAILABLE");
    }
    setCurrentAddress(label2);
    if (lat != null && lng != null) {
      moveMapTo(lat, lng);
    }
    updateParent({
      address: label2,
      // Keep area empty so we don't invent a wrong locality
      area: "",
      city,
      state,
      country,
      lat: lat ?? "",
      lng: lng ?? ""
    });
  };
  const handleCurrentLocationClick = async () => {
    setGeoError("");
    setShowSuggestions(false);
    setIsLocating(true);
    setLocateStatus("Getting your GPS location…");
    const canUseGps = typeof navigator !== "undefined" && !!navigator.geolocation && (typeof window === "undefined" || window.isSecureContext !== false);
    try {
      if (canUseGps) {
        try {
          let position;
          try {
            position = await getPositionAsync({
              enableHighAccuracy: false,
              timeout: 8e3,
              maximumAge: 12e4
            });
          } catch {
            setLocateStatus("Retrying location…");
            position = await getPositionAsync({
              enableHighAccuracy: false,
              timeout: 12e3,
              maximumAge: 0
            });
          }
          setLocateStatus("Finding your area & address…");
          await applyCurrentPosition(position.coords.latitude, position.coords.longitude);
          setGeoError("");
          return;
        } catch (gpsError) {
          console.warn("[Geolocation] GPS failed, trying IP fallback", gpsError?.code, gpsError?.message || gpsError);
        }
      }
      await applyIpFallbackLocation();
    } catch (err) {
      console.warn("[Geolocation] all strategies failed", err);
      setGeoError(messageForGeoError(err));
    } finally {
      setLocateStatus("");
      setIsLocating(false);
    }
  };
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", ref: wrapRef, children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-2 gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: "form-label fw-bold m-0 text-sm font-semibold",
          style: { color: "#0f172a" },
          children: [
            displayLabel,
            required && /* @__PURE__ */ jsx("span", { className: "text-rose-500", style: { color: "#f43f5e" }, children: " *" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "button-style-3 d-inline-flex align-items-center gap-1",
          onClick: handleCurrentLocationClick,
          disabled: isLocating,
          style: { padding: "8px 12px", fontSize: "0.82rem", lineHeight: 1.2 },
          children: [
            /* @__PURE__ */ jsx("i", { className: `fa-solid ${isLocating ? "fa-spinner fa-spin" : "fa-location-crosshairs"}` }),
            isLocating ? "Locating..." : "Use Current Location"
          ]
        }
      )
    ] }),
    geoError && /* @__PURE__ */ jsxs("p", { className: "text-warning small mb-2", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-triangle-exclamation me-1" }),
      geoError
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "position-relative mb-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          className: "form-control verify_input pe-5",
          placeholder: displayPlaceholder,
          value: isLocating ? locateStatus || "Getting your location…" : currentAddress,
          onChange: handleInputChange,
          disabled: isLocating,
          readOnly: isLocating,
          style: isLocating ? { cursor: "wait", color: "#606060" } : void 0,
          onFocus: () => {
            if (isLocating) return;
            if (suggestions.length) setShowSuggestions(true);
            else if (String(currentAddress || "").trim().length >= 2) {
              fetchSuggestions(currentAddress);
              setShowSuggestions(true);
            }
          },
          autoComplete: "off",
          "aria-busy": isLocating
        }
      ),
      /* @__PURE__ */ jsx(
        "i",
        {
          className: `fa-solid ${isLocating || suggestLoading ? "fa-spinner fa-spin" : "fa-magnifying-glass"} position-absolute end-0 top-50 translate-middle-y me-3`,
          style: { pointerEvents: "none", color: isLocating ? "#43ACE9" : "#9ca3af" }
        }
      ),
      showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsx(
        "ul",
        {
          className: "list-unstyled mb-0 bg-white border shadow-sm",
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            zIndex: 30,
            borderRadius: 8,
            maxHeight: 260,
            overflowY: "auto"
          },
          children: suggestions.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "w-100 text-start border-0 bg-transparent px-3 py-2",
              style: { color: "#23262F", fontSize: 14 },
              onMouseDown: (e) => e.preventDefault(),
              onClick: () => selectSuggestion(item),
              children: [
                /* @__PURE__ */ jsx("span", { className: "d-block fw-semibold", children: item.label }),
                item.secondary && /* @__PURE__ */ jsx("span", { className: "d-block small", style: { color: "#606060" }, children: item.secondary })
              ]
            }
          ) }, item.id))
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-2", children: error }),
    isLoaded && /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          position: "relative",
          width: "100%",
          height: "280px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          overflow: "hidden",
          backgroundColor: "#f3f4f6"
        },
        children: [
          !mapReady && /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                zIndex: 2,
                backgroundColor: "#f3f4f6"
              },
              className: "d-flex align-items-center justify-content-center text-muted",
              children: [
                /* @__PURE__ */ jsx("div", { className: "spinner-border spinner-border-sm me-2", role: "status" }),
                "Loading Map..."
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: mapContainerRef,
              style: {
                width: "100%",
                height: "100%"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "form-text text-muted small mt-1 d-block", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info me-1" }),
      helperText
    ] })
  ] });
}
export {
  GoogleLocationPicker as G
};
