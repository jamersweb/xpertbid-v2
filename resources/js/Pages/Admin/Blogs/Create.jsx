import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Create() {
        const { data, setData, post, processing, errors } = useForm({
               title: '',
               slug: '',
               content: '',
               image: null,
               meta_title: '',
               meta_description: '',
               canonical_url: '',
               schema_markup: '',
        });

        const submit = (e) => {
               e.preventDefault();
               post(route('admin.blogs.store'));
        };

        return (
               <AdminLayout title="Create New Blog">
                      <Head title="Create Blog" />

                      <div className="max-w-4xl pb-12">
                             <div className="mb-6 flex items-center justify-between">
                                    <Link href={route('admin.blogs.index')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center">
                                           <i className="fa-solid fa-arrow-left mr-2"></i> Back to Blogs
                                    </Link>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Blog Editor v2.0</span>
                             </div>

                             <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                                    <form onSubmit={submit}>
                                           <div className="p-8 space-y-8">
                                                  {/* Basic Content Section */}
                                                  <div className="space-y-6">
                                                         <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Blog Title</label>
                                                                <input
                                                                       type="text"
                                                                       className="w-full px-6 py-4 bg-gray-50 border-none focus:ring-4 focus:ring-black/5 focus:bg-white rounded-2xl transition-all text-gray-900 font-bold text-lg placeholder:text-gray-300"
                                                                       placeholder="Enter blog title..."
                                                                       value={data.title}
                                                                       onChange={e => setData('title', e.target.value)}
                                                                />
                                                                {errors.title && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.title}</p>}
                                                         </div>

                                                         <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Slug</label>
                                                                <input
                                                                       type="text"
                                                                       className="w-full px-6 py-4 bg-gray-50 border-none focus:ring-4 focus:ring-black/5 focus:bg-white rounded-2xl transition-all text-gray-900 font-bold placeholder:text-gray-300"
                                                                       placeholder="custom-blog-slug"
                                                                       value={data.slug}
                                                                       onChange={e => setData('slug', e.target.value)}
                                                                />
                                                                {errors.slug && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.slug}</p>}
                                                         </div>

                                                         <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Featured Image</label>
                                                                <div className="relative group">
                                                                       <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-100 border-dashed rounded-3xl hover:border-black hover:bg-gray-50/50 transition-all cursor-pointer relative overflow-hidden">
                                                                              <input 
                                                                                     type="file" 
                                                                                     className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                                                     onChange={e => setData('image', e.target.files[0])} 
                                                                              />
                                                                              <div className="space-y-2 text-center">
                                                                                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                                                            <i className="fa-solid fa-image text-2xl text-gray-300 group-hover:text-black transition-colors"></i>
                                                                                     </div>
                                                                                     <div className="flex text-sm text-gray-600 justify-center">
                                                                                            <span className="relative font-black text-black">Upload a file</span>
                                                                                            <p className="pl-1 text-gray-400">or drag and drop</p>
                                                                                     </div>
                                                                                     <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">PNG, JPG, GIF up to 2MB</p>
                                                                              </div>
                                                                       </div>
                                                                </div>
                                                                {data.image && (
                                                                       <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                                                                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                                                                     <i className="fa-solid fa-check"></i>
                                                                              </div>
                                                                              <div>
                                                                                     <p className="text-xs font-black text-emerald-900 truncate max-w-xs">{data.image.name}</p>
                                                                                     <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">File selected</p>
                                                                              </div>
                                                                       </div>
                                                                )}
                                                                {errors.image && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.image}</p>}
                                                         </div>

                                                         <div>
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Main Content</label>
                                                                <div className="admin-blog-quill">
                                                                       <ReactQuill
                                                                              theme="snow"
                                                                              value={data.content}
                                                                              onChange={(value) => setData('content', value)}
                                                                              placeholder="Write your blog content here..."
                                                                       />
                                                                </div>
                                                                {errors.content && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.content}</p>}
                                                         </div>
                                                  </div>

                                                  <div className="h-px bg-gray-100 mx-[-2rem]"></div>

                                                  {/* SEO Section */}
                                                  <div className="space-y-8 bg-gray-50/30 p-8 rounded-3xl border border-gray-50">
                                                         <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">
                                                                       <i className="fa-solid fa-earth-americas"></i>
                                                                </div>
                                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">SEO & Structured Data</h3>
                                                         </div>

                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div>
                                                                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Meta Title</label>
                                                                       <input
                                                                              type="text"
                                                                              className="w-full px-5 py-4 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-2xl transition-all text-gray-900 font-bold placeholder:text-gray-200"
                                                                              placeholder="Search engine title..."
                                                                              value={data.meta_title}
                                                                              onChange={e => setData('meta_title', e.target.value)}
                                                                       />
                                                                       {errors.meta_title && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.meta_title}</p>}
                                                                </div>

                                                                <div>
                                                                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Meta Description</label>
                                                                       <textarea
                                                                              className="w-full px-5 py-4 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-2xl transition-all text-gray-900 font-medium placeholder:text-gray-200 min-h-[110px]"
                                                                              placeholder="Short summary for search results..."
                                                                              value={data.meta_description}
                                                                              onChange={e => setData('meta_description', e.target.value)}
                                                                       />
                                                                       {errors.meta_description && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.meta_description}</p>}
                                                                </div>

                                                                <div className="md:col-span-2">
                                                                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Canonical URL</label>
                                                                       <input
                                                                              type="url"
                                                                              className="w-full px-5 py-4 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-2xl transition-all text-gray-900 font-bold placeholder:text-gray-200"
                                                                              placeholder="https://xpertbid.com/blogs/custom-blog-slug"
                                                                              value={data.canonical_url}
                                                                              onChange={e => setData('canonical_url', e.target.value)}
                                                                       />
                                                                       {errors.canonical_url && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.canonical_url}</p>}
                                                                </div>

                                                                <div className="md:col-span-2">
                                                                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Schema Markup (JSON-LD)</label>
                                                                       <textarea
                                                                              className="w-full px-5 py-5 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-3xl transition-all text-gray-900 font-mono text-xs placeholder:text-gray-200 min-h-[150px]"
                                                                              placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
                                                                              value={data.schema_markup}
                                                                              onChange={e => setData('schema_markup', e.target.value)}
                                                                       />
                                                                       {errors.schema_markup && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.schema_markup}</p>}
                                                                       <p className="mt-3 text-[10px] text-gray-400 font-bold italic px-1">* Use JSON format for structured data to improve Google ranking.</p>
                                                                </div>
                                                         </div>
                                                  </div>
                                           </div>

                                           <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                                                  <button
                                                         type="submit"
                                                         disabled={processing}
                                                         className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-gray-800 transition-all shadow-xl shadow-black/20 hover:shadow-black/10 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 text-xs flex items-center gap-3"
                                                  >
                                                         {processing ? (
                                                                <>
                                                                       <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
                                                                       Publishing...
                                                                </>
                                                         ) : (
                                                                <>
                                                                       Publish Blog Post
                                                                       <i className="fa-solid fa-paper-plane text-[9px]"></i>
                                                                </>
                                                         )}
                                                  </button>
                                           </div>
                                    </form>
                             </div>
                      </div>

                      <style>{`
                             .admin-blog-quill .ql-toolbar.ql-snow {
                                    border: none;
                                    border-bottom: 1px solid rgb(243 244 246);
                                    padding: 1.5rem 1.5rem;
                                    background: rgb(249 250 251);
                                    border-radius: 24px 24px 0 0;
                             }

                             .admin-blog-quill .ql-container.ql-snow {
                                    border: none;
                                    padding: 1rem 1rem;
                                    background: #fff;
                                    min-height: 400px;
                                    font-size: 16px;
                                    font-family: inherit;
                                    border-radius: 0 0 24px 24px;
                             }

                             .admin-blog-quill .ql-editor {
                                    min-height: 400px;
                                    color: #111827;
                                    line-height: 1.8;
                             }

                             .admin-blog-quill .ql-editor.ql-blank::before {
                                    color: #d1d5db;
                                    font-style: normal;
                                    left: 24px;
                                    font-weight: 500;
                             }
                             
                             .admin-blog-quill {
                                    border: 2px solid transparent;
                                    background: rgb(249 250 251);
                                    border-radius: 32px;
                                    overflow: hidden;
                                    transition: all 0.3s ease;
                             }

                             .admin-blog-quill:focus-within {
                                    border-color: rgba(0,0,0,0.05);
                                    background: #fff;
                                    box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
                             }
                      `}</style>
               </AdminLayout>
        );
}
