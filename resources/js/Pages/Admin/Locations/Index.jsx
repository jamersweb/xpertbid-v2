import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ countries }) {
       const [selectedCountry, setSelectedCountry] = useState(null);
       const [selectedState, setSelectedState] = useState(null);
       const [showModal, setShowModal] = useState(false);
       const [modalConfig, setModalConfig] = useState({ type: 'country', parentId: null, action: 'create' });

       const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
              name: '',
              type: 'country',
              parent_id: null
       });

       const handleAdd = (type, parentId = null) => {
              setModalConfig({ type, parentId, action: 'create' });
              setData({ name: '', type, parent_id: parentId });
              setShowModal(true);
       };

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.locations.store'), {
                     onSuccess: () => { setShowModal(false); reset(); }
              });
       };

       const handleDelete = (id, type) => {
              if (confirm(`Are you sure you want to delete this ${type}?`)) {
                     destroy(route('admin.locations.destroy', id), {
                            data: { type }
                     });
              }
       };

       return (
              <AdminLayout title="Location Management">
                     <Head title="Location Management" />

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Countries List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                                   <div className="p-4 border-bottom border-gray-100 flex items-center justify-between">
                                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Countries</h3>
                                          <button onClick={() => handleAdd('country')} className="p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                                 <i className="fa-solid fa-plus text-[10px]"></i>
                                          </button>
                                   </div>
                                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                          {countries.map(country => (
                                                 <div
                                                        key={country.id}
                                                        onClick={() => { setSelectedCountry(country); setSelectedState(null); }}
                                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCountry?.id === country.id ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50'}`}
                                                 >
                                                        <span className="text-sm font-semibold">{country.name}</span>
                                                        <div className="flex items-center gap-2">
                                                               <span className="text-[10px] opacity-60 font-mono">{country.states?.length || 0}</span>
                                                               <button onClick={(e) => { e.stopPropagation(); handleDelete(country.id, 'country'); }} className={`p-1.5 rounded-lg hover:bg-white/20 ${selectedCountry?.id === country.id ? 'text-white' : 'text-gray-400'}`}>
                                                                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                                                               </button>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </div>

                            {/* States List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                                   <div className="p-4 border-bottom border-gray-100 flex items-center justify-between">
                                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">States / {selectedCountry?.name || '...'}</h3>
                                          {selectedCountry && (
                                                 <button onClick={() => handleAdd('state', selectedCountry.id)} className="p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                                        <i className="fa-solid fa-plus text-[10px]"></i>
                                                 </button>
                                          )}
                                   </div>
                                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                          {!selectedCountry ? (
                                                 <div className="h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                                                        <i className="fa-solid fa-globe text-3xl mb-3"></i>
                                                        <p className="text-xs font-medium">Select a country to view its states</p>
                                                 </div>
                                          ) : (
                                                 selectedCountry.states?.map(state => (
                                                        <div
                                                               key={state.id}
                                                               onClick={() => setSelectedState(state)}
                                                               className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedState?.id === state.id ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50'}`}
                                                        >
                                                               <span className="text-sm font-semibold">{state.name}</span>
                                                               <div className="flex items-center gap-2">
                                                                      <span className="text-[10px] opacity-60 font-mono">{state.cities?.length || 0}</span>
                                                                      <button onClick={(e) => { e.stopPropagation(); handleDelete(state.id, 'state'); }} className={`p-1.5 rounded-lg hover:bg-white/20 ${selectedState?.id === state.id ? 'text-white' : 'text-gray-400'}`}>
                                                                             <i className="fa-solid fa-trash-can text-[10px]"></i>
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 ))
                                          )}
                                   </div>
                            </div>

                            {/* Cities List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                                   <div className="p-4 border-bottom border-gray-100 flex items-center justify-between">
                                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cities / {selectedState?.name || '...'}</h3>
                                          {selectedState && (
                                                 <button onClick={() => handleAdd('city', selectedState.id)} className="p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                                        <i className="fa-solid fa-plus text-[10px]"></i>
                                                 </button>
                                          )}
                                   </div>
                                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                          {!selectedState ? (
                                                 <div className="h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                                                        <i className="fa-solid fa-city text-3xl mb-3"></i>
                                                        <p className="text-xs font-medium">Select a state to view its cities</p>
                                                 </div>
                                          ) : (
                                                 selectedState.cities?.map(city => (
                                                        <div
                                                               key={city.id}
                                                               className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group"
                                                        >
                                                               <span className="text-sm font-semibold text-gray-700">{city.name}</span>
                                                               <button onClick={() => handleDelete(city.id, 'city')} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all">
                                                                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                                                               </button>
                                                        </div>
                                                 ))
                                          )}
                                   </div>
                            </div>
                     </div>

                     {/* Simple Add Modal */}
                     {showModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                   <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                                          <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                                 <h3 className="font-bold text-gray-800 capitalize">Add New {modalConfig.type}</h3>
                                                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black"><i className="fa-solid fa-xmark"></i></button>
                                          </div>
                                          <form onSubmit={submit} className="p-6 space-y-4">
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Name</label>
                                                        <input
                                                               type="text"
                                                               autoFocus
                                                               className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm"
                                                               placeholder={`Enter ${modalConfig.type} name...`}
                                                               value={data.name}
                                                               onChange={e => setData('name', e.target.value)}
                                                        />
                                                 </div>
                                                 <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                                                 >
                                                        {processing ? 'Adding...' : `Add ${modalConfig.type}`}
                                                 </button>
                                          </form>
                                   </div>
                            </div>
                     )}
              </AdminLayout>
       );
}
