import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function BidderMessaging() {
       const [activeTab, setActiveTab] = useState('bidder');
       const [products, setProducts] = useState([]);
       const [selectedProduct, setSelectedProduct] = useState('');
       const [bidders, setBidders] = useState([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [searchResults, setSearchResults] = useState([]);
       const [selectedUsers, setSelectedUsers] = useState([]);

       const { data, setData, post, processing, errors, reset } = useForm({
              subject: '',
              message: '',
              user_ids: [],
              direct_user_ids: [],
       });

       useEffect(() => {
              if (activeTab === 'bidder') {
                     fetchProducts('normal');
              }
       }, [activeTab]);

       const fetchProducts = async (type) => {
              const response = await axios.get(route('admin.bidder-communication.get-products', { type }));
              setProducts(response.data);
       };

       const handleProductChange = async (productId) => {
              setSelectedProduct(productId);
              if (productId) {
                     const response = await axios.get(route('admin.bidder-communication.get-bidders', { product_id: productId }));
                     setBidders(response.data);
              } else {
                     setBidders([]);
              }
       };

       const handleSearch = async (val) => {
              setSearchTerm(val);
              if (val.length > 2) {
                     const response = await axios.get(route('admin.bidder-communication.search-users', { q: val }));
                     setSearchResults(response.data);
              } else {
                     setSearchResults([]);
              }
       };

       const toggleUserSelection = (user, list) => {
              const field = list === 'bidder' ? 'user_ids' : 'direct_user_ids';
              const currentIds = data[field];
              if (currentIds.includes(user.id)) {
                     setData(field, currentIds.filter(id => id !== user.id));
              } else {
                     setData(field, [...currentIds, user.id]);
              }
       };

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.bidder-communication.send'), {
                     onSuccess: () => {
                            reset();
                            setSelectedUsers([]);
                     }
              });
       };

       return (
              <AdminLayout title="Bidder Communication">
                     <Head title="Bidder Messaging" />

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Recipient Selection */}
                            <div className="lg:col-span-1 space-y-6">
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                                                 <button
                                                        onClick={() => setActiveTab('bidder')}
                                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'bidder' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                 >
                                                        By Auction
                                                 </button>
                                                 <button
                                                        onClick={() => setActiveTab('direct')}
                                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'direct' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                 >
                                                        Direct Search
                                                 </button>
                                          </div>

                                          {activeTab === 'bidder' ? (
                                                 <div className="space-y-4">
                                                        <div>
                                                               <InputLabel value="Select Auction" />
                                                               <select
                                                                      className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                                      value={selectedProduct}
                                                                      onChange={(e) => handleProductChange(e.target.value)}
                                                               >
                                                                      <option value="">Choose an auction...</option>
                                                                      {products.map(p => (
                                                                             <option key={p.id} value={p.id}>{p.title}</option>
                                                                      ))}
                                                               </select>
                                                        </div>

                                                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                               {bidders.map(user => (
                                                                      <label key={user.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
                                                                             <input
                                                                                    type="checkbox"
                                                                                    className="rounded border-gray-300 text-black focus:ring-black"
                                                                                    checked={data.user_ids.includes(user.id)}
                                                                                    onChange={() => toggleUserSelection(user, 'bidder')}
                                                                             />
                                                                             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                                                    {user.profile_pic && <img src={user.profile_pic} alt="" className="w-full h-full object-cover" />}
                                                                             </div>
                                                                             <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                                                                                    <p className="text-[10px] text-gray-500 truncate">{user.email || user.phone}</p>
                                                                             </div>
                                                                      </label>
                                                               ))}
                                                               {bidders.length === 0 && selectedProduct && <p className="text-xs text-gray-400 text-center py-4">No bidders found for this auction.</p>}
                                                        </div>
                                                 </div>
                                          ) : (
                                                 <div className="space-y-4">
                                                        <div>
                                                               <InputLabel value="Search Users" />
                                                               <TextInput
                                                                      className="mt-1 block w-full"
                                                                      placeholder="Name, Email or Phone..."
                                                                      value={searchTerm}
                                                                      onChange={(e) => handleSearch(e.target.value)}
                                                               />
                                                        </div>

                                                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                               {searchResults.map(user => (
                                                                      <label key={user.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                                                             <input
                                                                                    type="checkbox"
                                                                                    className="rounded border-gray-300 text-black focus:ring-black"
                                                                                    checked={data.direct_user_ids.includes(user.id)}
                                                                                    onChange={() => toggleUserSelection(user, 'direct')}
                                                                             />
                                                                             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                                                    {user.profile_pic && <img src={user.profile_pic} alt="" className="w-full h-full object-cover" />}
                                                                             </div>
                                                                             <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                                                                                    <p className="text-[10px] text-gray-500 truncate">{user.email || user.phone}</p>
                                                                             </div>
                                                                      </label>
                                                               ))}
                                                        </div>
                                                 </div>
                                          )}
                                   </div>
                            </div>

                            {/* Right Column: Message Composition */}
                            <div className="lg:col-span-2">
                                   <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                                          <div>
                                                 <InputLabel htmlFor="subject" value="Message Subject" />
                                                 <TextInput
                                                        id="subject"
                                                        className="mt-1 block w-full"
                                                        value={data.subject}
                                                        onChange={(e) => setData('subject', e.target.value)}
                                                        placeholder="Enter message subject..."
                                                        required
                                                 />
                                                 <InputError message={errors.subject} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="message" value="Message Content (HTML Supported)" />
                                                 <textarea
                                                        id="message"
                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        rows="12"
                                                        value={data.message}
                                                        onChange={(e) => setData('message', e.target.value)}
                                                        placeholder="Write your message here... Use {{user_name}} for personalization."
                                                        required
                                                 ></textarea>
                                                 <InputError message={errors.message} className="mt-2" />
                                                 <p className="text-[10px] text-gray-400 mt-2 italic">
                                                        Note: For SMS delivery, HTML tags will be stripped and links will be converted to plain text format.
                                                 </p>
                                          </div>

                                          <div className="flex items-center justify-between pt-4 border-top border-gray-100">
                                                 <div className="text-sm font-medium text-gray-500">
                                                        <span className="text-black font-bold">{(data.user_ids.length + data.direct_user_ids.length)}</span> recipients selected
                                                 </div>
                                                 <PrimaryButton disabled={processing}>
                                                        <i className="fa-solid fa-paper-plane me-2"></i> Send Broadcast
                                                 </PrimaryButton>
                                          </div>
                                   </form>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
            `}} />
              </AdminLayout>
       );
}
