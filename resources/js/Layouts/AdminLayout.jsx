import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';

export default function AdminLayout({ children, title }) {
       const [isSidebarOpen, setIsSidebarOpen] = useState(true);
       const { auth } = usePage().props;
       const user = auth?.user;

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
                                          <div className="flex items-center gap-2">
                                                 <img src="/assets/images/header-logo.png" alt="XpertBid" className="h-8" />
                                                 <span className="text-gray-300 mx-1">|</span>
                                                 <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                                          </div>
                                   </div>

                                   <div className="flex items-center gap-4">
                                          <div className="relative group">
                                                 <button className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                                                        {user?.profile_pic ? (
                                                               <img src={user.profile_pic} alt="Admin" className="w-8 h-8 rounded-full border border-gray-200" />
                                                        ) : (
                                                               <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                                                                      {user?.name?.charAt(0) || 'A'}
                                                               </div>
                                                        )}
                                                        <div className="text-left hidden md:block px-1">
                                                               <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || 'Admin'}</p>
                                                               <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter font-semibold">{user?.role || 'Administrator'}</p>
                                                        </div>
                                                        <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 ms-1 me-1"></i>
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
