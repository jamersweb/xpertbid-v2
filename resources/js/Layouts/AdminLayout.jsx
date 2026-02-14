import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';

export default function AdminLayout({ children, title }) {
       const [isSidebarOpen, setIsSidebarOpen] = useState(true);

       return (
              <div className="admin-layout flex min-h-screen bg-gray-50">
                     <Head title={`Admin - ${title}`} />

                     {/* Sidebar */}
                     <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                     {/* Main Content Area */}
                     <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                            {/* Admin Header */}
                            <header className="h-16 bg-white border-bottom border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
                                   <div className="flex items-center gap-4">
                                          <button
                                                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                                 className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                                          >
                                                 <i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} fs-5`}></i>
                                          </button>
                                          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                   </div>

                                   <div className="flex items-center gap-4">
                                          <div className="relative group">
                                                 <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                                               A
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">Administrator</span>
                                                        <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                                                 </button>
                                          </div>
                                   </div>
                            </header>

                            {/* Page Content */}
                            <main className="p-6">
                                   {children}
                            </main>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .admin-layout .bg-primary { background-color: #000; }
                .admin-layout .text-primary { color: #000; }
                .admin-layout .border-primary { border-color: #000; }
            `}} />
              </div>
       );
}
