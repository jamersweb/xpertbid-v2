import axios from 'axios';

const MAP_URL_PATTERNS = [
       /google\.com\/maps/i,
       /maps\.google\.com/i,
       /goo\.gl\/maps/i,
       /maps\.app\.goo\.gl/i,
];

const SHORT_MAP_URL_PATTERNS = [
       /goo\.gl\/maps/i,
       /maps\.app\.goo\.gl/i,
];

const COORDINATE_PATTERN = /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/;

const isValidCoordinate = (lat, lng) =>
       Number.isFinite(lat)
       && Number.isFinite(lng)
       && lat >= -90
       && lat <= 90
       && lng >= -180
       && lng <= 180;

const normalizeCategoryFeatures = (categoryFeatures) => {
       if (!categoryFeatures) {
              return null;
       }

       if (typeof categoryFeatures === 'string') {
              try {
                     return JSON.parse(categoryFeatures);
              } catch (error) {
                     return null;
              }
       }

       if (typeof categoryFeatures === 'object') {
              return categoryFeatures;
       }

       return null;
};

export const isGoogleMapsUrl = (value) => {
       if (typeof value !== 'string') {
              return false;
       }

       return MAP_URL_PATTERNS.some((pattern) => pattern.test(value));
};

export const isShortGoogleMapsUrl = (value) => {
       if (typeof value !== 'string') {
              return false;
       }

       return SHORT_MAP_URL_PATTERNS.some((pattern) => pattern.test(value));
};

export const findGoogleMapsUrl = (categoryFeatures) => {
       const parsedFeatures = normalizeCategoryFeatures(categoryFeatures);

       if (!parsedFeatures) {
              return null;
       }

       const values = Array.isArray(parsedFeatures)
              ? parsedFeatures
              : Object.values(parsedFeatures);

       for (const value of values) {
              if (isGoogleMapsUrl(value)) {
                     return value.trim();
              }
       }

       return null;
};

const coordinatesFromMatch = (match) => {
       if (!match) {
              return null;
       }

       const lat = Number.parseFloat(match[1]);
       const lng = Number.parseFloat(match[2]);

       return isValidCoordinate(lat, lng) ? { lat, lng } : null;
};

export const parseGoogleMapsCoordinates = (url) => {
       if (typeof url !== 'string' || !url.trim()) {
              return null;
       }

       const trimmedUrl = url.trim();

       try {
              const parsedUrl = new URL(trimmedUrl);
              const queryValue = parsedUrl.searchParams.get('q');

              if (queryValue) {
                     const fromQuery = coordinatesFromMatch(decodeURIComponent(queryValue).match(COORDINATE_PATTERN));
                     if (fromQuery) {
                            return fromQuery;
                     }
              }
       } catch (error) {
              // Continue with regex parsing for pasted or partially encoded map URLs.
       }

       const fromAtPattern = coordinatesFromMatch(trimmedUrl.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,|z|$)/i));
       if (fromAtPattern) {
              return fromAtPattern;
       }

       return coordinatesFromMatch(trimmedUrl.match(/[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i));
};

const resolveShortMapUrl = async (shortUrl) => {
       const response = await axios.post('/api/resolve-map-url', { url: shortUrl });
       const data = response?.data || {};

       return data.resolved_url
              || data.resolvedUrl
              || data.final_url
              || data.finalUrl
              || data.url
              || null;
};

export const extractMapCoordinates = async (categoryFeatures) => {
       const mapUrl = findGoogleMapsUrl(categoryFeatures);

       if (!mapUrl) {
              return null;
       }

       const directCoordinates = parseGoogleMapsCoordinates(mapUrl);
       if (directCoordinates) {
              return directCoordinates;
       }

       if (!isShortGoogleMapsUrl(mapUrl)) {
              return null;
       }

       try {
              const resolvedUrl = await resolveShortMapUrl(mapUrl);
              return parseGoogleMapsCoordinates(resolvedUrl);
       } catch (error) {
              return null;
       }
};
