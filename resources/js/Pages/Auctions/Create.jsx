import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ListTypeSelection from '@/Components/SellSteps/ListTypeSelection';
import CategorySelection from '@/Components/SellSteps/CategorySelection';
import DetailsForm from '@/Components/SellSteps/DetailsForm';
import VerificationStep from '@/Components/SellSteps/VerificationStep';
import MediaUpload from '@/Components/SellSteps/MediaUpload';
import SummaryCard from '@/Components/SellSteps/SummaryCard';
import axios from 'axios';
import '@/../css/sell.css'; // Import custom styles for Sell page

export default function Create({ categories, listing = null }) {
       const { auth } = usePage().props;

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
              list_type: listing?.list_type || 'auction',
              category_id: listing?.category_id || '',
              sub_category_id: listing?.sub_category_id || '',
              child_category_id: listing?.child_category_id || '',

              title: listing?.title || '',
              description: listing?.description || '',
              product_year: listing?.product_year || '',
              product_location: listing?.product_location || '',

              minimum_bid: listing?.minimum_bid || '',
              reserve_price: listing?.reserve_price || '',
              start_date: formatDateForInput(listing?.start_date),
              end_date: formatDateForInput(listing?.end_date),
              product_condition: listing?.product_condition || '',
              variations: listing?.variations || [],
              discount_type: listing?.discount_type || '',
              discount_value: listing?.discount_value || '',
              status: listing?.status || 'inactive',

              property_type: listing?.property_type || '',
              property_address: listing?.property_address || '',
              title_deed_number: listing?.title_deed_number || '',
              property_documents: [],

              vehicle_make_model: listing?.vehicle_make_model || '',
              year_of_manufacture: listing?.year_of_manufacture || '',
              chassis_vin: listing?.chassis_vin || '',
              vehicle_documents: [],
       });

       const [files, setFiles] = useState([]);
       const [existingFiles, setExistingFiles] = useState(() => {
              if (listing?.album) {
                     try {
                            const album = typeof listing.album === 'string' ? JSON.parse(listing.album) : listing.album;
                            return Array.isArray(album) ? album : [];
                     } catch (e) {
                            console.error("Failed to parse existing album", e);
                            return [];
                     }
              }
              return listing?.image ? [listing.image] : [];
       });

       const [isSavingDraft, setIsSavingDraft] = useState(false);

       // Effect to find category objects if editing
       useEffect(() => {
              if (listing && categories && !selectedCategory) {
                     const cat = categories.find(c => String(c.id) === String(listing.category_id));
                     if (cat) setSelectedCategory(cat);
                     // Note: sub/child cats are usually fetched via API in CategorySelection.jsx
                     // For pre-filling, CategorySelection will manage finding them if needed.
              }
       }, [listing, categories, selectedCategory]);

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

              let payload = { ...formData, status };
              if (payload.list_type === 'normal_list' && payload.variations?.length > 0) {
                     const prices = payload.variations.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
                     if (prices.length > 0) {
                            payload.minimum_bid = Math.min(...prices);
                     }
              }

              const data = new FormData();
              Object.keys(payload).forEach(key => {
                     const val = payload[key];
                     if (key === 'property_documents' || key === 'vehicle_documents') return;
                     if (key === 'variations') {
                            data.append(key, JSON.stringify(val));
                            return;
                     }
                     if (val !== null && val !== undefined) data.append(key, val);
              });

              files.forEach(file => data.append('album[]', file));
              existingFiles.forEach(url => data.append('existing_album[]', url));
              formData.property_documents?.forEach(file => data.append('property_documents[]', file));
              formData.vehicle_documents?.forEach(file => data.append('vehicle_documents[]', file));

              data.append('user_id', auth.user.id);

              try {
                     if (listing && listing.id) {
                            data.append('_method', 'PUT');
                            await axios.post(route('auctions.update', { id: listing.id }), data, {
                                   headers: { 'Content-Type': 'multipart/form-data' }
                            });
                     } else {
                            await axios.post('/auctions', data, {
                                   headers: { 'Content-Type': 'multipart/form-data' }
                            });
                     }
                     if (listing) {
                            router.visit(route('auctions.mylistings'), { preserveState: false });
                     } else {
                            router.visit(route('dashboard'), { preserveState: false });
                     }
              } catch (error) {
                     console.error("Submission failed", error);
                     alert("Failed to submit auction: " + (error.response?.data?.message || error.message));
                     setIsSavingDraft(false);
              }
       };

       const handleSubmit = () => submitAuction('inactive');
       const handleSaveDraft = () => submitAuction('draft');

       // Summary Data Object for children
       const summaryData = {
              listType: formData.list_type === 'auction' ? 'Auction' : 'Normal List',
              listTypeDescription: formData.list_type === 'auction' ? 'Let buyers bid and compete for your listing.' : 'Set a fixed price for direct purchase requests.',
              category: selectedCategory,
              subCategory: selectedSubCategory,
              childCategory: selectedChildCategory,
              categoryIcon: getCategoryMedia(selectedCategory),
              listingTitle: formData.title,
       };

       return (
              <AppLayout title={listing ? "Edit Listing" : "Start Selling"}>
                     <Head title={listing ? "Edit Listing" : "Start Selling"} />

                     <div className="bg-white min-vh-100">
                            {step === 'listType' && (
                                   <ListTypeSelection
                                          onSelect={handleListTypeSelect}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                   />
                            )}

                            {step === 'category' && (
                                   <CategorySelection
                                          categories={categories}
                                          onSelect={handleCategorySelect}
                                          onBack={() => setStep('listType')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
                                   />
                            )}

                            {step === 'details' && (
                                   <DetailsForm
                                          listType={formData.list_type}
                                          formData={formData}
                                          setFormData={setFormData}
                                          summaryData={summaryData}
                                          onContinue={handleDetailsContinue}
                                          onBack={() => setStep('category')}
                                          onEditListType={() => setStep('listType')}
                                          onEditCategory={() => setStep('category')}
                                          onSaveDraft={handleSaveDraft}
                                          isSavingDraft={isSavingDraft}
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
                                   />
                            )}
                     </div>
              </AppLayout>
       );
}
