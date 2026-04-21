import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ListTypeSelection from '@/Components/SellSteps/ListTypeSelection';
import CategorySelection from '@/Components/SellSteps/CategorySelection';
import DetailsForm from '@/Components/SellSteps/DetailsForm';
import VerificationStep from '@/Components/SellSteps/VerificationStep';
import MediaUpload from '@/Components/SellSteps/MediaUpload';
import axios from 'axios';
import '@/../css/sell.css'; // Import custom styles for Sell page

export default function Create({ categories, countries = [], profileLocation = null, listing = null, vehicleVerification = null, propertyVerification = null }) {
       const { auth } = usePage().props;
       const individualVerificationStatus =
              auth?.user?.individual_verification?.status || auth?.user?.individualVerification?.status || '';
       const corporateVerificationStatus =
              auth?.user?.corporate_verification?.status || auth?.user?.corporateVerification?.status || '';
       const canPublishListing = [individualVerificationStatus, corporateVerificationStatus].some(
              (status) => ['verified', 'approved'].includes(String(status || '').toLowerCase())
       );
       const publishBlockedMessage = 'Complete individual or corporate verification before publishing a listing. You can still save it as a draft.';
       const listingData = listing?.listing_data || {};
       const categoryFeatures = listing?.category_features || {};
       const initialListType = listing?.list_type === 'normal' || listing?.listing_type === 'normal'
              ? 'normal_list'
              : listing?.list_type === 'business' || listing?.listing_type === 'business'
              ? 'business_list'
              : 'auction';

       // Steps: listType -> category -> details -> (verification) -> media -> submit
       const [step, setStep] = useState(listing ? 'details' : 'listType');
       const [selectedCategory, setSelectedCategory] = useState(null);
       const [selectedSubCategory, setSelectedSubCategory] = useState(null);
       const [selectedChildCategory, setSelectedChildCategory] = useState(null);

       // --- helpers ---
       const buildAbsoluteMediaUrl = (path) => {
              if (!path) return "https://admin.xpertbid.com/assets/images/category_images/1750684943_6859550f2948f.png";
              if (path.startsWith("http://") || path.startsWith("https://")) return path;
              const clean = path.replace(/^\/+/, "");
              return `https://admin.xpertbid.com/${clean}`;
       };

       const getCategoryMedia = (item) => {
              const candidate = item?.image || item?.icon || item?.thumbnail || item?.photo || item?.media;
              return buildAbsoluteMediaUrl(candidate);
       };

       const formatDateForInput = (dateStr) => {
              if (!dateStr) return '';
              if (dateStr.includes('T') && dateStr.length >= 16) return dateStr.substring(0, 16);
              try {
                     const date = new Date(dateStr);
                     return dateStr.replace(' ', 'T').substring(0, 16);
              } catch (e) {
                     return '';
              }
       };

       const [formData, setFormData] = useState({
              list_type: listing ? initialListType : 'auction',
              category_id: listing?.category_id || '',
              sub_category_id: listing?.sub_category_id || '',
              child_category_id: listing?.child_category_id || '',

              title: listing?.title || '',
              description: listing?.description || '',

              minimum_bid: listing?.minimum_bid || listingData.minimum_bid || listingData.start_price || listingData.price || '',
              reserve_price: listing?.reserve_price || listingData.reserve_price || '',
              start_date: formatDateForInput(listing?.start_date),
              end_date: formatDateForInput(listing?.end_date),
              variations: listing?.variations || listingData.variations || [],
              discount_type: listing?.discount_type || listingData.discount_type || '',
              discount_value: listing?.discount_value || listingData.discount_value || '',
              status: listing?.status || 'inactive',

              property_type: listing?.property_type || propertyVerification?.property_type || categoryFeatures.property_type || '',
              property_address: listing?.property_address || propertyVerification?.property_address || categoryFeatures.property_address || '',
              title_deed_number: listing?.title_deed_number || propertyVerification?.title_deed_number || categoryFeatures.title_deed_number || '',
              property_documents: [],

              vehicle_make_model: listing?.vehicle_make_model || vehicleVerification?.vehicle_make_model || categoryFeatures.vehicle_make_model || '',
              year_of_manufacture: listing?.year_of_manufacture || vehicleVerification?.year_of_manufacture || categoryFeatures.year_of_manufacture || '',
              chassis_vin: listing?.chassis_vin || vehicleVerification?.chassis_vin || categoryFeatures.chassis_vin || '',
              vehicle_documents: [],
              existing_property_documents: propertyVerification?.property_documents || categoryFeatures.property_documents || [],
              existing_vehicle_documents: vehicleVerification?.vehicle_documents || categoryFeatures.vehicle_documents || [],
              category_features: categoryFeatures,
              stock: listing?.stock || listingData.stock || '',
              quantity: listingData.quantity || '',
              country_id: ['', null, undefined, 'null', 'undefined'].includes(listing?.country_id) ? (['', null, undefined, 'null', 'undefined'].includes(listingData.country_id) ? '' : String(listingData.country_id)) : String(listing?.country_id),
              state_id: ['', null, undefined, 'null', 'undefined'].includes(listing?.state_id) ? (['', null, undefined, 'null', 'undefined'].includes(listingData.state_id) ? '' : String(listingData.state_id)) : String(listing?.state_id),
              city_id: ['', null, undefined, 'null', 'undefined'].includes(listing?.city_id) ? (['', null, undefined, 'null', 'undefined'].includes(listingData.city_id) ? '' : String(listingData.city_id)) : String(listing?.city_id),
       });

       const [files, setFiles] = useState([]);
       const [existingFiles, setExistingFiles] = useState(() => {
              if (listing?.album_urls?.length) {
                     return listing.album_urls;
              }
              if (listing?.album) {
                     try {
                            const album = typeof listing.album === 'string' ? JSON.parse(listing.album) : listing.album;
                            return Array.isArray(album)
                                   ? album.map(item => buildAbsoluteMediaUrl(item))
                                   : [];
                     } catch (e) {
                            console.error("Failed to parse existing album", e);
                            return [];
                     }
              }
              return listing?.image_url ? [listing.image_url] : (listing?.image ? [buildAbsoluteMediaUrl(listing.image)] : []);
       });

       const [isSavingDraft, setIsSavingDraft] = useState(false);
       const [dynamicFields, setDynamicFields] = useState([]);
       const [locationCountries, setLocationCountries] = useState(countries || []);
       const [locationStates, setLocationStates] = useState([]);
       const [locationCities, setLocationCities] = useState([]);
       const [autoLocationTried, setAutoLocationTried] = useState(false);
       const [profileLocationTried, setProfileLocationTried] = useState(false);
       const isDraftListing = listing?.is_draft === true || listing?.status === 'draft';

       const hasValidLocationId = (value) => !['', null, undefined, 'null', 'undefined', 0, '0'].includes(value);

       const normalizeLocationName = (value) => String(value || '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '');

       const findLocationMatch = (items, targetName) => {
              if (!targetName || !Array.isArray(items)) return null;
              const target = normalizeLocationName(targetName);
              if (!target) return null;

              return items.find((item) => {
                     const name = normalizeLocationName(item?.name);
                     return name === target || name.includes(target) || target.includes(name);
              }) || null;
       };

       const loadStates = async (countryId) => {
              if (!countryId) {
                     setLocationStates([]);
                     return [];
              }

              try {
                     const res = await axios.get('/get-states/' + countryId);
                     const states = res.data?.state || [];
                     setLocationStates(states);
                     return states;
              } catch (err) {
                     console.error("Failed to fetch states", err);
                     setLocationStates([]);
                     return [];
              }
       };

       const loadCities = async (stateId) => {
              if (!stateId) {
                     setLocationCities([]);
                     return [];
              }

              try {
                     const res = await axios.get('/get-cities/' + stateId);
                     const cities = res.data?.city || [];
                     setLocationCities(cities);
                     return cities;
              } catch (err) {
                     console.error("Failed to fetch cities", err);
                     setLocationCities([]);
                     return [];
              }
       };

       const detectLocationFromBrowser = () => new Promise((resolve, reject) => {
              if (typeof window === 'undefined' || !navigator?.geolocation) {
                     reject(new Error('Geolocation not supported'));
                     return;
              }
              const geoErrorMap = {
                     1: 'PERMISSION_DENIED',
                     2: 'POSITION_UNAVAILABLE',
                     3: 'TIMEOUT',
              };

              if (navigator?.permissions?.query) {
                     navigator.permissions
                            .query({ name: 'geolocation' })
                            .then((status) => {
                                   console.info(`[Geolocation] permission state: ${status.state}`);
                            })
                            .catch(() => {
                                   // Ignore permissions API errors, geolocation call below is the source of truth.
                            });
              }

              navigator.geolocation.getCurrentPosition(
                     async (position) => {
                            try {
                                   const { latitude, longitude } = position.coords;
                                   const response = await fetch(
                                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                                   );
                                   const data = await response.json();

                                   resolve({
                                          country: data?.countryName || '',
                                          state: data?.principalSubdivision || '',
                                          city: data?.city || data?.locality || '',
                                   });
                            } catch (error) {
                                   reject(error);
                            }
                     },
                     (error) => reject({
                            code: error?.code ?? null,
                            reason: geoErrorMap[error?.code] || 'UNKNOWN',
                            message: error?.message || 'Geolocation failed',
                     }),
                     { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
              );
       });

       const detectLocationFromIP = async () => {
              const response = await fetch('/detect-location-ip');
              const data = await response.json();

              return {
                     country: data?.country || '',
                     state: data?.state || '',
                     city: data?.city || '',
                     source: data?.source || 'ip',
              };
       };

       // Effect to find category objects if editing
       useEffect(() => {
              if (listing && categories && !selectedCategory) {
                     const cat = categories.find(c => String(c.id) === String(listing.category_id));
                     if (cat) setSelectedCategory(cat);
              }
       }, [listing, categories, selectedCategory]);

       useEffect(() => {
              if (Array.isArray(countries) && countries.length > 0) {
                     setLocationCountries(countries);
                     return;
              }

              axios.get('/get-countries')
                     .then(res => setLocationCountries(res.data?.country || []))
                     .catch(err => console.error("Failed to fetch countries", err));
       }, [countries]);

       useEffect(() => {
              if (!hasValidLocationId(formData.country_id)) {
                     setLocationStates([]);
                     setLocationCities([]);
                     return;
              }

              loadStates(formData.country_id);
       }, [formData.country_id]);

       useEffect(() => {
              if (!hasValidLocationId(formData.state_id)) {
                     setLocationCities([]);
                     return;
              }

              loadCities(formData.state_id);
       }, [formData.state_id]);

       useEffect(() => {
              if (profileLocationTried) return;
              if (
                     !hasValidLocationId(profileLocation?.country_id) &&
                     !hasValidLocationId(profileLocation?.state_id) &&
                     !hasValidLocationId(profileLocation?.city_id)
              ) {
                     setProfileLocationTried(true);
                     return;
              }

              let cancelled = false;

              const prefillFromProfileLocation = async () => {
                     try {
                            const countryId = hasValidLocationId(profileLocation?.country_id) ? String(profileLocation.country_id) : '';
                            const stateIdFromProfile = hasValidLocationId(profileLocation?.state_id) ? String(profileLocation.state_id) : '';
                            const cityIdFromProfile = hasValidLocationId(profileLocation?.city_id) ? String(profileLocation.city_id) : '';

                            if (!countryId) return;

                            const states = await loadStates(countryId);
                            if (cancelled) return;

                            const stateId = stateIdFromProfile && states.some((state) => String(state.id) === stateIdFromProfile)
                                   ? stateIdFromProfile
                                   : '';

                            let cityId = '';
                            if (stateId) {
                                   const cities = await loadCities(stateId);
                                   if (cancelled) return;

                                   if (cityIdFromProfile && cities.some((city) => String(city.id) === cityIdFromProfile)) {
                                          cityId = cityIdFromProfile;
                                   }
                            }

                            setFormData((prev) => {
                                   return {
                                          ...prev,
                                          country_id: hasValidLocationId(prev.country_id) ? prev.country_id : countryId,
                                          state_id: hasValidLocationId(prev.state_id) ? prev.state_id : stateId,
                                          city_id: hasValidLocationId(prev.city_id) ? prev.city_id : cityId,
                                   };
                            });
                     } finally {
                            if (!cancelled) {
                                   setProfileLocationTried(true);
                            }
                     }
              };

              prefillFromProfileLocation();

              return () => {
                     cancelled = true;
              };
       }, [profileLocationTried, profileLocation, formData.country_id, formData.state_id, formData.city_id]);

       useEffect(() => {
              if (autoLocationTried) return;
              if (!profileLocationTried) return;
              if (!locationCountries.length) return;
              if (hasValidLocationId(formData.country_id) && hasValidLocationId(formData.state_id) && hasValidLocationId(formData.city_id)) return;

              let cancelled = false;

              const autoFillLocation = async () => {
                     try {
                            let detected = null;
                            let usedIpFallback = false;
                            try {
                                   detected = await detectLocationFromBrowser();
                            } catch (err) {
                                   console.warn('Geolocation denied/failed, trying IP fallback.', {
                                          code: err?.code ?? null,
                                          reason: err?.reason || 'UNKNOWN',
                                          message: err?.message || '',
                                   });
                            }

                            if (!detected) {
                                   try {
                                          detected = await detectLocationFromIP();
                                          usedIpFallback = true;
                                   } catch (err) {
                                          console.warn('IP location fallback failed.');
                                          return;
                                   }
                            }

                            if (cancelled || !detected) return;

                            const selectedCountry = hasValidLocationId(formData.country_id)
                                   ? locationCountries.find((country) => String(country.id) === String(formData.country_id))
                                   : null;
                            const detectedCountry = findLocationMatch(locationCountries, detected.country);
                            const matchedCountry = selectedCountry || detectedCountry;
                            if (!matchedCountry) return;

                            const states = await loadStates(matchedCountry.id);
                            if (cancelled) return;

                            const matchedState = !usedIpFallback ? findLocationMatch(states, detected.state) : null;
                            const stateId = hasValidLocationId(formData.state_id)
                                   ? String(formData.state_id)
                                   : (matchedState?.id ? String(matchedState.id) : '');

                            let cityId = '';
                            if (stateId && !usedIpFallback) {
                                   const cities = await loadCities(stateId);
                                   if (cancelled) return;
                                   const matchedCity = findLocationMatch(cities, detected.city);
                                   cityId = hasValidLocationId(formData.city_id)
                                          ? String(formData.city_id)
                                          : (matchedCity?.id ? String(matchedCity.id) : '');
                            }

                            setFormData((prev) => {
                                   return {
                                          ...prev,
                                          country_id: hasValidLocationId(prev.country_id) ? prev.country_id : (matchedCountry.id || ''),
                                          state_id: hasValidLocationId(prev.state_id) ? prev.state_id : stateId,
                                          city_id: hasValidLocationId(prev.city_id) ? prev.city_id : cityId,
                                   };
                            });
                     } finally {
                            if (!cancelled) {
                                   setAutoLocationTried(true);
                            }
                     }
              };

              autoFillLocation();

              return () => {
                     cancelled = true;
              };
       }, [autoLocationTried, profileLocationTried, locationCountries, formData.country_id, formData.state_id, formData.city_id]);

       // Effect to fetch dynamic fields
       useEffect(() => {
              if (formData.category_id) {
                     let type = formData.list_type;
                     if (type === 'normal_list') type = 'normal';
                     if (type === 'business_list') type = 'business';

                     axios.get('/get-dynamic-fields/' + formData.category_id + '/' + type)
                            .then(res => {
                                   if (res.data.status === 'success') {
                                          setDynamicFields(res.data.data || []);
                                   }
                            })
                            .catch(err => console.error("Failed to fetch dynamic fields", err));
              } else {
                     setDynamicFields([]);
              }
       }, [formData.category_id, formData.list_type]);

       // --- handlers ---

       const handleListTypeSelect = (type) => {
              setFormData(prev => ({ ...prev, list_type: type }));
              setStep('category');
       };

       const handleCategorySelect = ({ category, subCategory, childCategory }) => {
              setSelectedCategory(category);
              setSelectedSubCategory(subCategory);
              setSelectedChildCategory(childCategory);

              setFormData(prev => ({
                     ...prev,
                     category_id: category?.id,
                     sub_category_id: subCategory?.id || '',
                     child_category_id: childCategory?.id || '',
              }));
              setStep('details');
       };

       const handleDetailsContinue = () => {
              const catId = String(formData.category_id);
              if (catId === '222' || catId === '311') {
                     setStep('verification');
              } else {
                     setStep('media');
              }
       };

       const handleVerificationContinue = () => {
              setStep('media');
       };

       const submitAuction = async (status) => {
              if (!auth.user) {
                     router.get(route('login'));
                     return;
              }

              if (status === 'draft') {
                     setIsSavingDraft(true);
              }

              // Mapping list_type to enum values used in migrations
              let listing_type = formData.list_type;
              if (listing_type === 'normal_list') listing_type = 'normal';
              if (listing_type === 'business_list') listing_type = 'business';

              // Helper to clean up object (remove null/empty/undefined)
              const cleanData = (obj) => {
                     return Object.entries(obj).reduce((acc, [key, value]) => {
                            if (value !== null && value !== undefined && value !== '') {
                                   acc[key] = value;
                            }
                            return acc;
                     }, {});
              };

              // Restructuring payload for JSON columns
              const listing_data = cleanData({
                     price: formData.minimum_bid,
                     reserve_price: formData.reserve_price,
                     start_date: formData.start_date,
                     end_date: formData.end_date,
                     variations: formData.variations,
                     discount_type: formData.discount_type,
                     discount_value: formData.discount_value,
                     stock: formData.stock,
                     quantity: formData.quantity,
                     country_id: formData.country_id,
                     state_id: formData.state_id,
                     city_id: formData.city_id,
              });

              let category_features = { ...formData.category_features };
              const catId = String(formData.category_id);

              // Only include verification fields if the category is Property or Vehicle
              if (catId === '222') {
                     category_features.property_type = formData.property_type;
                     category_features.property_address = formData.property_address;
                     category_features.title_deed_number = formData.title_deed_number;
              } else if (catId === '311') {
                     category_features.vehicle_make_model = formData.vehicle_make_model;
                     category_features.year_of_manufacture = formData.year_of_manufacture;
                     category_features.chassis_vin = formData.chassis_vin;
              }

              category_features = cleanData(category_features);

              const data = new FormData();
              const selectedCurrency = typeof window !== 'undefined'
                     ? (localStorage.getItem('xb_currency') || 'PKR')
                     : 'PKR';
              const sourcePlatform = typeof window !== 'undefined'
                     ? 'web'
                     : null;
              data.append('listing_type', listing_type);
              data.append('category_id', formData.category_id);
              data.append('sub_category_id', formData.sub_category_id);
              data.append('child_category_id', formData.child_category_id);
              data.append('title', formData.title);
              data.append('description', formData.description);
              data.append('country_id', formData.country_id || '');
              data.append('state_id', formData.state_id || '');
              data.append('city_id', formData.city_id || '');
              data.append('status', status);
              data.append('selected_currency', selectedCurrency);
              if (sourcePlatform) {
                     data.append('listing_source', sourcePlatform);
              }
              data.append('listing_data', JSON.stringify(listing_data));
              data.append('category_features', JSON.stringify(category_features));

              files.forEach(file => data.append('album[]', file));
              existingFiles.forEach(url => data.append('existing_album[]', url));

              // Conditionally append verification documents
              if (catId === '222') {
                     formData.property_documents?.forEach(file => data.append('property_documents[]', file));
              } else if (catId === '311') {
                     formData.vehicle_documents?.forEach(file => data.append('vehicle_documents[]', file));
              }

              data.append('user_id', auth.user.id);

                     try {
                     if (listing && listing.id) {
                            data.append('_method', 'PUT');
                            router.post(
                                   isDraftListing
                                          ? route('auctions.drafts.update', { draft: listing.id })
                                          : route('auctions.update', { listing: listing.slug || listing.id }),
                                   data,
                                   {
                                   forceFormData: true,
                                   onSuccess: () => {
                                          setIsSavingDraft(false);
                                   },
                                   onError: (errors) => {
                                          console.error("Submission failed", errors);
                                          alert("Failed to update listing. Please check the form.");
                                          setIsSavingDraft(false);
                                   }
                                   }
                            );
                     } else {
                            router.post('/auctions', data, {
                                   forceFormData: true,
                                   onSuccess: () => {
                                          setIsSavingDraft(false);
                                   },
                                   onError: (errors) => {
                                          console.error("Submission failed", errors);
                                          alert("Failed to submit listing. Please check the form.");
                                          setIsSavingDraft(false);
                                   }
                            });
                     }
              } catch (error) {
                     console.error("Submission error", error);
                     setIsSavingDraft(false);
              }
       };

       const handleSubmit = () => {
              if (!canPublishListing) {
                     alert(publishBlockedMessage);
                     return;
              }

              submitAuction(listing ? 'resubmit' : 'inactive');
       };
       const handleSaveDraft = () => submitAuction('draft');

       // Summary Data Object for children
       const summaryData = {
              listType: formData.list_type === 'auction' ? 'Auction' : (formData.list_type === 'business_list' ? 'Business List' : 'Normal List'),
              listTypeDescription: formData.list_type === 'auction' 
                     ? 'Let buyers bid and compete for your listing.' 
                     : (formData.list_type === 'business_list' 
                            ? 'Manage inventory, stock, and business-specific details.' 
                            : 'Set a fixed price for direct purchase requests.'),
              category: selectedCategory,
              subCategory: selectedSubCategory,
              childCategory: selectedChildCategory,
              categoryIcon: getCategoryMedia(selectedCategory),
              listingTitle: formData.title,
       };

       const needsVerificationStep = ['222', '311'].includes(String(formData.category_id || ''));
       const progressSteps = needsVerificationStep
              ? ['listType', 'category', 'details', 'verification', 'media']
              : ['listType', 'category', 'details', 'media'];
       const currentStepIndex = Math.max(progressSteps.indexOf(step), 0);
       const progressPercent = Math.round(((currentStepIndex + 1) / progressSteps.length) * 100);

       return (
              <AppLayout title={listing ? "Edit Listing" : "Start Selling"}>
                     <Head title={listing ? "Edit Listing" : "Start Selling"} />
                     <div className="bg-white min-vh-100">
                            {step === 'listType' && (
                                   <ListTypeSelection
                                          onSelect={handleListTypeSelect}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                          progressPercent={progressPercent}
                                   />
                            )}

                            {step === 'category' && (
                                   <CategorySelection
                                          categories={categories}
                                          onSelect={handleCategorySelect}
                                          onBack={() => setStep('listType')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                          progressPercent={progressPercent}
                                   />
                            )}

                            {step === 'details' && (
                                   <DetailsForm
                                          listType={formData.list_type}
                                          formData={formData}
                                          setFormData={setFormData}
                                          countries={locationCountries}
                                          states={locationStates}
                                          cities={locationCities}
                                          summaryData={summaryData}
                                          dynamicFields={dynamicFields}
                                          onContinue={handleDetailsContinue}
                                          onBack={() => setStep('category')}
                                          onEditListType={() => setStep('listType')}
                                          onEditCategory={() => setStep('category')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                          progressPercent={progressPercent}
                                   />
                            )}

                            {step === 'verification' && (
                                   <VerificationStep
                                          categoryId={formData.category_id}
                                          formData={formData}
                                          setFormData={setFormData}
                                          summaryData={summaryData}
                                          onContinue={handleVerificationContinue}
                                          onBack={() => setStep('details')}
                                          onEditListType={() => setStep('listType')}
                                          onEditCategory={() => setStep('category')}
                                          onEditDetails={() => setStep('details')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                          progressPercent={progressPercent}
                                   />
                            )}

                            {step === 'media' && (
                                   <MediaUpload
                                          files={files}
                                          setFiles={setFiles}
                                          existingFiles={existingFiles}
                                          setExistingFiles={setExistingFiles}
                                          summaryData={summaryData}
                                          onContinue={handleSubmit}
                                          onBack={() => setStep(formData.category_id === '222' || formData.category_id === '311' ? 'verification' : 'details')}
                                          onEditListType={() => setStep('listType')}
                                          onEditCategory={() => setStep('category')}
                                          onEditDetails={() => setStep('details')}
                                          onEditVerification={() => setStep('verification')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                          canPublish={canPublishListing}
                                          publishBlockedMessage={publishBlockedMessage}
                                          progressPercent={progressPercent}
                                   />
                            )}
                     </div>
              </AppLayout>
       );
}
