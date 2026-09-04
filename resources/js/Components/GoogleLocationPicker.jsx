import React, { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function GoogleLocationPicker({
       addressValue = '',
       latitudeValue = '',
       longitudeValue = '',
       onChange,
       error = '',
}) {
       const mapContainerRef = useRef(null);
       const inputRef = useRef(null);
       const mapRef = useRef(null);
       const markerRef = useRef(null);
       const autocompleteRef = useRef(null);

       const [isLoaded, setIsLoaded] = useState(false);
       const [loadError, setLoadError] = useState(false);
       const [currentAddress, setCurrentAddress] = useState(addressValue);

       // Synchronize internal state with external address prop
       useEffect(() => {
              setCurrentAddress(addressValue || '');
       }, [addressValue]);

       // Load Google Maps Script safely
       useEffect(() => {
              if (!API_KEY) {
                     setLoadError(true);
                     return;
              }

              const checkMapsReady = () => {
                     return Boolean(
                            window.google &&
                            window.google.maps &&
                            typeof window.google.maps.Map === 'function'
                     );
              };

              if (checkMapsReady()) {
                     setIsLoaded(true);
                     return;
              }

              const scriptId = 'google-maps-script';
              let existingScript = document.getElementById(scriptId);

              const onScriptLoad = () => {
                     // If async loading, wait until Map constructor is populated
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

              if (!existingScript) {
                     existingScript = document.createElement('script');
                     existingScript.id = scriptId;
                     existingScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
                     existingScript.async = true;
                     existingScript.defer = true;

                     existingScript.onload = onScriptLoad;
                     existingScript.onerror = () => setLoadError(true);

                     document.head.appendChild(existingScript);
              } else {
                     existingScript.addEventListener('load', onScriptLoad);
                     onScriptLoad();
              }
       }, []);

       // Initialize Map & Autocomplete
       useEffect(() => {
              if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

              try {
                     const google = window.google;
                     if (!google || !google.maps || typeof google.maps.Map !== 'function') {
                            setLoadError(true);
                            return;
                     }

                     const defaultLat = parseFloat(latitudeValue) || 24.8607; // Default to Karachi/PK if not specified
                     const defaultLng = parseFloat(longitudeValue) || 67.0011;
                     const defaultPos = { lat: defaultLat, lng: defaultLng };

                     const mapOptions = {
                            center: defaultPos,
                            zoom: latitudeValue && longitudeValue ? 15 : 12,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: true,
                            zoomControl: true,
                     };

                     const map = new google.maps.Map(mapContainerRef.current, mapOptions);
                     mapRef.current = map;

                     const marker = new google.maps.Marker({
                            position: defaultPos,
                            map: map,
                            draggable: true,
                            animation: google.maps.Animation ? google.maps.Animation.DROP : undefined,
                            title: 'Property Location',
                     });
                     markerRef.current = marker;

                     // Reverse geocode helper
                     const geocodePosition = (pos) => {
                            if (!google.maps.Geocoder) return;
                            const geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ location: pos }, (results, status) => {
                                   if (status === 'OK' && results && results[0]) {
                                          const formattedAddress = results[0].formatted_address;
                                          setCurrentAddress(formattedAddress);
                                          updateParent({
                                                 address: formattedAddress,
                                                 lat: pos.lat,
                                                 lng: pos.lng,
                                          });
                                   } else {
                                          updateParent({
                                                 lat: pos.lat,
                                                 lng: pos.lng,
                                          });
                                   }
                            });
                     };

                     // Drag end listener
                     marker.addListener('dragend', () => {
                            const newPos = marker.getPosition();
                            if (!newPos) return;
                            const lat = newPos.lat();
                            const lng = newPos.lng();
                            geocodePosition({ lat, lng });
                     });

                     // Map click listener
                     map.addListener('click', (e) => {
                            if (!e.latLng) return;
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();
                            marker.setPosition({ lat, lng });
                            geocodePosition({ lat, lng });
                     });

                     // Autocomplete setup
                     if (inputRef.current && google.maps.places && typeof google.maps.places.Autocomplete === 'function') {
                            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                                   types: ['geocode', 'establishment'],
                            });
                            autocompleteRef.current = autocomplete;

                            autocomplete.addListener('place_changed', () => {
                                   const place = autocomplete.getPlace();
                                   if (!place || !place.geometry || !place.geometry.location) {
                                          return;
                                   }

                                   const lat = place.geometry.location.lat();
                                   const lng = place.geometry.location.lng();
                                   const formattedAddress = place.formatted_address || place.name || (inputRef.current ? inputRef.current.value : '');

                                   map.setCenter({ lat, lng });
                                   map.setZoom(16);
                                   marker.setPosition({ lat, lng });

                                   setCurrentAddress(formattedAddress);
                                   updateParent({
                                          address: formattedAddress,
                                          lat,
                                          lng,
                                   });
                            });
                     }
              } catch (err) {
                     console.error('Google Maps initialization error:', err);
                     setLoadError(true);
              }
       }, [isLoaded]);

       const updateParent = ({ address, lat, lng }) => {
              const finalAddress = address !== undefined ? address : currentAddress;
              const finalLat = lat !== undefined ? lat : latitudeValue;
              const finalLng = lng !== undefined ? lng : longitudeValue;
              const mapUrl = (finalLat && finalLng) ? `https://maps.google.com/maps?q=${finalLat},${finalLng}` : '';

              if (onChange) {
                     onChange({
                            property_address: finalAddress,
                            latitude: finalLat,
                            longitude: finalLng,
                            map_url: mapUrl,
                     });
              }
       };

       const handleInputChange = (e) => {
              const val = e.target.value;
              setCurrentAddress(val);
              updateParent({ address: val });
       };

       const [geoError, setGeoError] = useState('');
       const [isLocating, setIsLocating] = useState(false);

       const handleCurrentLocationClick = () => {
              setGeoError('');
              if (!navigator.geolocation) {
                     setGeoError('Geolocation is not supported by your browser.');
                     return;
              }

              setIsLocating(true);
              navigator.geolocation.getCurrentPosition(
                     (position) => {
                            setIsLocating(false);
                            setGeoError('');
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;

                            if (mapRef.current && markerRef.current) {
                                   mapRef.current.setCenter({ lat, lng });
                                   mapRef.current.setZoom(16);
                                   markerRef.current.setPosition({ lat, lng });
                            }

                            if (window.google && window.google.maps && window.google.maps.Geocoder) {
                                   const geocoder = new window.google.maps.Geocoder();
                                   geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                          let formattedAddress = '';
                                          if (status === 'OK' && results && results[0]) {
                                                 formattedAddress = results[0].formatted_address;
                                          }
                                          setCurrentAddress(formattedAddress);
                                          updateParent({
                                                 address: formattedAddress,
                                                 lat,
                                                 lng,
                                          });
                                   });
                            } else {
                                   updateParent({ lat, lng });
                            }
                     },
                     (err) => {
                            setIsLocating(false);
                            console.warn('Geolocation warning:', err?.message || err);
                            // Only set error if position was not determined
                            if (err.code === 1) { // PERMISSION_DENIED
                                   setGeoError('Location permission denied by browser settings.');
                            } else if (err.code === 2 || err.code === 3) {
                                   // Timeout or Position Unavailable - fallback silently without warning banner
                                   setGeoError('');
                            }
                     },
                     { timeout: 15000, enableHighAccuracy: false, maximumAge: 60000 }
              );
       };

       if (loadError || !API_KEY) {
              return (
                     <div className="form-group mb-4">
                            <label className="form-label fw-bold">Property Address <span className="text-danger">*</span></label>
                            <input
                                   type="text"
                                   className="form-control verify_input"
                                   placeholder="Please enter property address"
                                   value={addressValue || ''}
                                   onChange={(e) => updateParent({ address: e.target.value })}
                            />
                            {error && <p className="text-danger small mt-1">{error}</p>}
                     </div>
              );
       }

       return (
              <div className="form-group mb-4">
                     <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label fw-bold m-0">
                                   Property Location on Map <span className="text-danger">*</span>
                            </label>
                             <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1"
                                    onClick={handleCurrentLocationClick}
                                    disabled={isLocating}
                                    style={{ fontSize: '0.82rem' }}
                             >
                                    <i className={`fa-solid ${isLocating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}></i>
                                    {isLocating ? 'Locating...' : 'Use Current Location'}
                             </button>
                      </div>

                      {geoError && <p className="text-warning small mb-2"><i className="fa-solid fa-triangle-exclamation me-1"></i>{geoError}</p>}

                      <div className="position-relative mb-3">
                            <input
                                   ref={inputRef}
                                   type="text"
                                   className="form-control verify_input pe-5"
                                   placeholder="Search address or location on Google Maps..."
                                   value={currentAddress}
                                   onChange={handleInputChange}
                            />
                            <i
                                   className="fa-solid fa-magnifying-glass position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                                   style={{ pointerEvents: 'none' }}
                            ></i>
                     </div>

                     {error && <p className="text-danger small mt-1 mb-2">{error}</p>}

                     <div
                            ref={mapContainerRef}
                            style={{
                                   width: '100%',
                                   height: '280px',
                                   borderRadius: '8px',
                                   border: '1px solid #d1d5db',
                                   overflow: 'hidden',
                                   backgroundColor: '#f3f4f6',
                            }}
                     >
                            {!isLoaded && (
                                   <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                          Loading Map...
                                   </div>
                            )}
                     </div>
                     <span className="form-text text-muted small mt-1 d-block">
                            <i className="fa-solid fa-circle-info me-1"></i>
                            Search an address above or drag/click the map pin to pin-point the exact location of your property.
                     </span>
              </div>
       );
}
