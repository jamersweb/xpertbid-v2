import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ faq }) {
       const { data, setData, put, processing, errors } = useForm({
              question_text: faq.question_text || '',
              answer_text: faq.answer_text || '',
              status: faq.status || 'Active'
       });

       const submit = (e) => {
              e.preventDefault();
              put(route('admin.faqs.update', faq.id));
       };

       return (
              <AdminLayout title="Edit FAQ">
                     <Head title="Edit FAQ" />

                     <div className="max-w-4xl">
                            <div className="mb-6">
                                   <Link href={route('admin.faqs.index')} className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
                                          <i className="fa-solid fa-arrow-left mr-2"></i> Back to FAQs
                                   </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                   <form onSubmit={submit} className="space-y-6">
                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Question</label>
                                                 <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all"
                                                        placeholder="e.g. How do I place a bid?"
                                                        value={data.question_text}
                                                        onChange={e => setData('question_text', e.target.value)}
                                                 />
                                                 {errors.question_text && <p className="mt-1 text-xs text-rose-500">{errors.question_text}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Answer</label>
                                                 <textarea
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all min-h-[150px]"
                                                        placeholder="Provide the detailed answer here..."
                                                        value={data.answer_text}
                                                        onChange={e => setData('answer_text', e.target.value)}
                                                 />
                                                 {errors.answer_text && <p className="mt-1 text-xs text-rose-500">{errors.answer_text}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                                 <select
                                                        className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all font-medium"
                                                        value={data.status}
                                                        onChange={e => setData('status', e.target.value)}
                                                 >
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                 </select>
                                                 {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
                                          </div>

                                          <div className="pt-4">
                                                 <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                 >
                                                        {processing ? 'Saving...' : 'Update FAQ'}
                                                 </button>
                                          </div>
                                   </form>
                            </div>
                     </div>
              </AdminLayout>
       );
}
