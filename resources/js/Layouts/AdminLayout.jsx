import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import CurrencyPicker from '@/Components/CurrencyPicker';
import useTranslate from '@/hooks/useTranslate';
import useSessionKeepAlive from '@/hooks/useSessionKeepAlive';

export default function AdminLayout({ children, title }) {
       const [isSidebarOpen, setIsSidebarOpen] = useState(true);
       const { auth, locale } = usePage().props;
       const user = auth?.user;
       const { t } = useTranslate();
       const supportedLocales = Object.entries(locale?.supported || {});
       const currentLocale = locale?.current || 'en';
       const currentDirection = locale?.supported?.[currentLocale]?.direction || (currentLocale === 'ur' ? 'rtl' : 'ltr');
       useSessionKeepAlive(Boolean(user));

       const handleLogout = () => {
              router.post(route('logout'));
       };

       const handleLocaleChange = (nextLocale) => {
              if (nextLocale === currentLocale) return;

              router.post(route('locale.update'), { locale: nextLocale }, {
                     preserveScroll: true,
              });
       };

       useEffect(() => {
              if (typeof document === 'undefined') return;

              document.documentElement.lang = currentLocale;
              document.documentElement.dir = currentDirection;
              document.body.classList.toggle('locale-ur', currentLocale === 'ur');
              document.body.classList.toggle('locale-rtl', currentDirection === 'rtl');
       }, [currentLocale, currentDirection]);

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
                                   </div>

                                   <div className="flex items-center gap-4">
                                          <div className="admin-language-switcher">
                                                 <select
                                                        className="admin-language-select"
                                                        value={currentLocale}
                                                        onChange={(e) => handleLocaleChange(e.target.value)}
                                                        aria-label={t('Select Language')}
                                                 >
                                                        {supportedLocales.map(([code, details]) => (
                                                               <option key={code} value={code}>
                                                                      {details.native || details.name || code.toUpperCase()}
                                                               </option>
                                                        ))}
                                                 </select>
                                          </div>
                                          <CurrencyPicker />
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

                                                 <div className="absolute right-0 top-full mt-2 hidden min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg group-hover:block">
                                                        <div className="px-4 py-3 border-bottom border-gray-100">
                                                               <p className="mb-1 text-sm fw-bold text-dark">{user?.name || 'Admin'}</p>
                                                               <p className="mb-0 text-xs text-secondary">{user?.email || 'admin@xpertbid.com'}</p>
                                                        </div>
                                                        <button
                                                               type="button"
                                                               onClick={handleLogout}
                                                               className="w-100 text-start px-4 py-3 border-0 bg-white d-flex align-items-center gap-2 text-danger fw-semibold hover:bg-red-50"
                                                        >
                                                               <i className="fa-solid fa-right-from-bracket"></i>
                                                               {t('Log Out')}
                                                        </button>
                                                 </div>
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
                .admin-language-select {
                    height: 38px;
                    border: 1px solid #d8e0ea;
                    border-radius: 10px;
                    padding: 0 12px;
                    background: #f8fbff;
                    color: #23262f;
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                }
            `}} />
              </div>
       );
}
