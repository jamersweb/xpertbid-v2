import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
       const { data, setData, post, processing, errors } = useForm({
              title: '',
              content: '',
              image: null,
       });

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.blogs.store'));
       };

       return (
              <AdminLayout title="Create New Blog">
                     <Head title="Create Blog" />

                     <div className="max-w-4xl">
                            <div className="mb-6">
                                   <Link href={route('admin.blogs.index')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Blogs
                                   </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                   <form onSubmit={submit} className="space-y-6">
                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title</label>
                                                 <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all"
                                                        placeholder="Enter blog title..."
                                                        value={data.title}
                                                        onChange={e => setData('title', e.target.value)}
                                                 />
                                                 {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image</label>
                                                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-black transition-colors">
                                                        <div className="space-y-1 text-center">
                                                               <i className="fa-solid fa-image text-3xl text-gray-400 mb-2"></i>
                                                               <div className="flex text-sm text-gray-600">
                                                                      <label className="relative cursor-pointer bg-white rounded-md font-bold text-black hover:text-gray-700">
                                                                             <span>Upload a file</span>
                                                                             <input type="file" className="sr-only" onChange={e => setData('image', e.target.files[0])} />
                                                                      </label>
                                                                      <p className="pl-1">or drag and drop</p>
                                                               </div>
                                                               <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                                        </div>
                                                 </div>
                                                 {data.image && <p className="mt-2 text-xs text-emerald-600 font-bold flex items-center"><i className="fa-solid fa-circle-check mr-1"></i> {data.image.name} selected</p>}
                                                 {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                                                 <textarea
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all min-h-[300px]"
                                                        placeholder="Write your blog content here..."
                                                        value={data.content}
                                                        onChange={e => setData('content', e.target.value)}
                                                 />
                                                 {errors.content && <p className="mt-1 text-xs text-rose-500">{errors.content}</p>}
                                          </div>

                                          <div className="pt-4">
                                                 <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                 >
                                                        {processing ? 'Publishing...' : 'Publish Blog Post'}
                                                 </button>
                                          </div>
                                   </form>
                            </div>
                     </div>
              </AdminLayout>
       );
}
