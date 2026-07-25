import { useEffect, useState } from 'react';
import { extractMapCoordinates, findGoogleMapsUrl } from '@/Utils/mapLocation';

export default function PropertyLocationMap({ categoryFeatures }) {
       const mapUrl = findGoogleMapsUrl(categoryFeatures);
       const [coordinates, setCoordinates] = useState(null);
       const [isLoading, setIsLoading] = useState(true);
       const [hasTriedResolving, setHasTriedResolving] = useState(false);
       const [leafletModules, setLeafletModules] = useState(null);

       useEffect(() => {
              let isMounted = true;

              const ensureLeafletStyles = () => {
                     if (typeof document === 'undefined') {
                            return;
                     }

                     const existingLink = document.querySelector('link[data-leaflet-styles="true"]');
                     if (existingLink) {
                            return;
                     }

                     const link = document.createElement('link');
                     link.rel = 'stylesheet';
                     link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                     link.crossOrigin = '';
                     link.setAttribute('data-leaflet-styles', 'true');
                     document.head.appendChild(link);
              };

              ensureLeafletStyles();

              const loadMapModules = async () => {
                     if (typeof window === 'undefined') {
                            return;
                     }

                     const [reactLeaflet, leaflet] = await Promise.all([
                            import('react-leaflet'),
                            import('leaflet'),
                     ]);
                     const locationIcon = leaflet.divIcon({
                            className: 'property-location-marker',
                            html: `
                                   <span class="property-location-marker__pin">
                                          <span class="property-location-marker__core"></span>
                                   </span>
                            `,
                            iconSize: [28, 36],
                            iconAnchor: [14, 36],
                            popupAnchor: [0, -34],
                     });

                     if (isMounted) {
                            setLeafletModules({
                                   MapContainer: reactLeaflet.MapContainer,
                                   TileLayer: reactLeaflet.TileLayer,
                                   Marker: reactLeaflet.Marker,
                                   Popup: reactLeaflet.Popup,
                                   locationIcon,
                            });
                     }
              };

              loadMapModules().catch(() => {
                     if (isMounted) {
                            setLeafletModules(null);
                     }
              });

              return () => {
                     isMounted = false;
              };
       }, []);

       useEffect(() => {
              if (!mapUrl) {
                     setCoordinates(null);
                     setHasTriedResolving(false);
                     setIsLoading(false);
                     return;
              }

              let isMounted = true;

              const resolveCoordinates = async () => {
                     setIsLoading(true);
                     setHasTriedResolving(false);

                     const parsedCoordinates = await extractMapCoordinates(categoryFeatures);

                     if (isMounted) {
                            setCoordinates(parsedCoordinates);
                            setHasTriedResolving(true);
                            setIsLoading(false);
                     }
              };

              resolveCoordinates().catch(() => {
                     if (isMounted) {
                            setCoordinates(null);
                            setHasTriedResolving(true);
                            setIsLoading(false);
                     }
              });

              return () => {
                     isMounted = false;
              };
       }, [categoryFeatures, mapUrl]);

       if (!mapUrl) {
              return null;
       }

       const showLoading = isLoading || (coordinates && !leafletModules);

       if (showLoading) {
              return (
                     <div className="property-location-map property-location-map--state">
                            <div className="property-location-spinner" aria-label="Loading location" />
                            <span>Loading location...</span>
                            <style>{propertyLocationMapStyles}</style>
                     </div>
              );
       }

       if (!coordinates || !leafletModules || !hasTriedResolving) {
              return (
                     <div className="property-location-map property-location-map--state">
                            <span>Location not available</span>
                            <style>{propertyLocationMapStyles}</style>
                     </div>
              );
       }

       const { MapContainer, TileLayer, Marker, Popup, locationIcon } = leafletModules;
       const position = [coordinates.lat, coordinates.lng];

       return (
              <div className="property-location-map">
                     <MapContainer
                            center={position}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ width: '100%', height: '100%' }}
                     >
                            <TileLayer
                                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position} icon={locationIcon}>
                                   <Popup>Property location</Popup>
                            </Marker>
                     </MapContainer>
                     <style>{propertyLocationMapStyles}</style>
              </div>
       );
}

const propertyLocationMapStyles = `
       .property-location-map {
              width: 100%;
              height: 360px;
              min-height: 300px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
              background: #f8fafc;
       }

       .property-location-map--state {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              color: #6b7280;
              font-size: 14px;
              font-weight: 600;
       }

       .property-location-marker {
              background: transparent;
              border: 0;
       }

       .property-location-marker__pin {
              position: relative;
              display: block;
              width: 22px;
              height: 22px;
              margin: 0 auto;
              background: #ef4444;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
       }

       .property-location-marker__core {
              position: absolute;
              inset: 5px;
              border-radius: 50%;
              background: #ffffff;
       }

       .property-location-spinner {
              width: 18px;
              height: 18px;
              border: 2px solid #d1d5db;
              border-top-color: #43ace9;
              border-radius: 999px;
              animation: property-location-spin 0.7s linear infinite;
       }

       @keyframes property-location-spin {
              to {
                     transform: rotate(360deg);
              }
       }

       @media (max-width: 767px) {
              .property-location-map {
                     height: 280px;
                     min-height: 260px;
              }
       }
`;
