import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ blogs }) {
       const deleteBlog = (id) => {
              if (confirm('Are you sure you want to delete this blog post?')) {
                     router.delete(route('admin.blogs.destroy', id));
              }
       };

       return (
              <AdminLayout title="Blog Management">
                     <Head title="Blog Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                   <h3 className="font-bold text-gray-800">All Blogs</h3>
                                   <Link href={route('admin.blogs.create')} className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                                          Add New Blog
                                   </Link>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Image</th>
                                                        <th className="px-6 py-4">Title</th>
                                                        <th className="px-6 py-4">Author</th>
                                                        <th className="px-6 py-4">Created At</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {blogs.data.map((blog) => (
                                                        <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <img src={blog.image ? `/${blog.image}` : '/images/placeholder.png'} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800">{blog.title}</p>
                                                                      <p className="text-[10px] text-gray-400">/{blog.slug}</p>
                                                               </td>
                                                               <td className="px-6 py-4 text-sm text-gray-600">
                                                                      {blog.user?.name || 'Admin'}
                                                               </td>
                                                               <td className="px-6 py-4 text-xs text-gray-500">
                                                                      {new Date(blog.created_at).toLocaleDateString()}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <Link href={route('admin.blogs.edit', blog.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </Link>
                                                                             <button onClick={() => deleteBlog(blog.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors">
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                             </button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     </div>
              </AdminLayout>
       );
}
