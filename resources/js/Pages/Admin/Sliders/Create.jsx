import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
       const { data, setData, post, processing, errors } = useForm({
              title: '',
              subtitle: '',
              description: '',
              image: null,
              slider_category_id: ''
       });

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.sliders.store'));
       };

       return (
              <AdminLayout title="Add New Slider">
                     <Head title="Add Slider" />

                     <div className="max-w-4xl">
                            <div className="mb-6">
                                   <Link href={route('admin.sliders.index')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Sliders
                                   </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                   <form onSubmit={submit} className="space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Slider Title</label>
                                                        <input
                                                               type="text"
                                                               className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all"
                                                               placeholder="Enter title..."
                                                               value={data.title}
                                                               onChange={e => setData('title', e.target.value)}
                                                        />
                                                        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
                                                 </div>
                                                 <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                                        <select
                                                               className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all font-medium"
                                                               value={data.slider_category_id}
                                                               onChange={e => setData('slider_category_id', e.target.value)}
                                                        >
                                                               <option value="">Select Category</option>
                                                               {categories.map(cat => (
                                                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                               ))}
                                                        </select>
                                                        {errors.slider_category_id && <p className="mt-1 text-xs text-rose-500">{errors.slider_category_id}</p>}
                                                 </div>
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
                                                 <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all"
                                                        placeholder="Enter subtitle..."
                                                        value={data.subtitle}
                                                        onChange={e => setData('subtitle', e.target.value)}
                                                 />
                                                 {errors.subtitle && <p className="mt-1 text-xs text-rose-500">{errors.subtitle}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Slider Image</label>
                                                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-black transition-colors">
                                                        <div className="space-y-1 text-center">
                                                               <i className="fa-solid fa-image text-3xl text-gray-400 mb-2"></i>
                                                               <input type="file" className="sr-only" id="slider-image" onChange={e => setData('image', e.target.files[0])} />
                                                               <label htmlFor="slider-image" className="relative cursor-pointer bg-white rounded-md font-bold text-black hover:text-gray-700">
                                                                      <span>Upload a file</span>
                                                               </label>
                                                               <p className="text-xs text-gray-500">Wide aspect ratio recommended (1920x600)</p>
                                                        </div>
                                                 </div>
                                                 {data.image && <p className="mt-2 text-xs text-emerald-600 font-bold flex items-center"><i className="fa-solid fa-circle-check mr-1"></i> {data.image.name} selected</p>}
                                                 {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                                 <textarea
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all min-h-[100px]"
                                                        placeholder="Enter short description..."
                                                        value={data.description}
                                                        onChange={e => setData('description', e.target.value)}
                                                 />
                                                 {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                                          </div>

                                          <div className="pt-4">
                                                 <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                 >
                                                        {processing ? 'Creating...' : 'Create Slider'}
                                                 </button>
                                          </div>
                                   </form>
                            </div>
                     </div>
              </AdminLayout>
       );
}
