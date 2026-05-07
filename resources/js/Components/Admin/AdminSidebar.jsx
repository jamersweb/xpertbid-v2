import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';

const menuItems = [
       { name: 'Dashboard', icon: 'fa-gauge-high', route: 'admin.dashboard', permission: 'dashboard-list' },
       { name: 'Listings', icon: 'fa-gavel', route: 'admin.listings.index', permission: 'auction-list' },
       { name: 'Live', icon: 'fa-satellite-dish', route: 'admin.live.index', permission: 'auction-list' },
       { name: 'Live Auctions', icon: 'fa-tower-broadcast', route: 'admin.live-auctions.index', permission: 'auction-list' },
       { name: 'Bids', icon: 'fa-hand-holding-dollar', route: 'admin.bids.index', permission: 'auction-list' },
       { name: 'Orders', icon: 'fa-cart-shopping', route: 'admin.orders.index', permission: 'order-list' },
       { type: 'divider', label: 'Verifications' },
       { name: 'Listings Approval', icon: 'fa-clipboard-check', route: 'admin.verifications.auctions.index', permission: 'auction-verification-list' },
       { name: 'Individual', icon: 'fa-user-check', route: 'admin.verifications.individual.index', permission: 'individual-verification-list' },
       { name: 'Corporate', icon: 'fa-building-circle-check', route: 'admin.verifications.corporate.index', permission: 'corporate-verification-list' },
       // { name: 'Vehicles', icon: 'fa-car-side', route: 'admin.verifications.vehicle.index' },
       // { name: 'Properties', icon: 'fa-house-circle-check', route: 'admin.verifications.property.index' },
       { type: 'divider', label: 'Management' },
       { name: 'Users', icon: 'fa-users', route: 'admin.users.index', permission: 'user-list' },
       // { name: 'Payments', icon: 'fa-money-bill-transfer', route: 'admin.payment-requests.index' },
       { name: 'Categories', icon: 'fa-layer-group', route: 'admin.categories.index', permission: 'category-list' },
       { name: 'Dynamic Fields', icon: 'fa-wand-magic-sparkles', route: 'admin.dynamic-fields.index', permission: 'category-list' },
       { name: 'Blogs', icon: 'fa-newspaper', route: 'admin.blogs.index', permission: 'blog-list' },
       { type: 'divider', label: 'Site Content' },
       { name: 'Sliders', icon: 'fa-images', route: 'admin.sliders.index', permission: 'slider-list' },
       { name: 'FAQs', icon: 'fa-circle-question', route: 'admin.faqs.index' },
       { type: 'divider', label: 'System' },
       { name: 'General Settings', icon: 'fa-gears', route: 'admin.master-settings.index' },
       { name: 'Languages', icon: 'fa-language', route: 'admin.languages.index' },
       { name: 'Currencies', icon: 'fa-money-bill-wave', route: 'admin.currencies.index' },
       { name: 'Locations', icon: 'fa-location-dot', route: 'admin.locations.index' },
       { type: 'divider', label: 'Tools' },
       { name: 'SEO', icon: 'fa-magnifying-glass-chart', route: 'admin.seo.index', permission: 'seo-list' },
       { name: 'Bidder Messaging', icon: 'fa-message', route: 'admin.bidder-communication.index' },
       { name: 'CRM (Outreach)', icon: 'fa-people-arrows', route: 'admin.crm.index' },
       { name: 'Email Logs', icon: 'fa-envelope-open-text', route: 'admin.email-logs.index' },
       { name: 'Roles & Permissions', icon: 'fa-user-shield', route: 'admin.roles.index', permission: 'role-list' },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
       const { url, props } = usePage();
       const { t } = useTranslate();
       const role = String(props?.auth?.user?.role || '').toLowerCase();
       const permissions = new Set(props?.auth?.permissions || []);
       const isFullAdmin = ['admin', 'superadmin'].includes(role);

       const canShowMenuItem = (item) => {
              if (item.type === 'divider') {
                     return true;
              }

              if (isFullAdmin) {
                     return true;
              }

              return item.permission ? permissions.has(item.permission) : false;
       };

       const visibleMenuItems = [];
       let pendingDivider = null;

       menuItems.forEach((item) => {
              if (item.type === 'divider') {
                     pendingDivider = item;
                     return;
              }

              if (!canShowMenuItem(item)) {
                     return;
              }

              if (pendingDivider && visibleMenuItems.length > 0) {
                     visibleMenuItems.push(pendingDivider);
              }

              visibleMenuItems.push(item);
              pendingDivider = null;
       });

       const homeRoute = visibleMenuItems.find((item) => item.route)?.route || 'admin.dashboard';

       return (
              <aside
                     className={`fixed left-0 top-0 h-screen bg-white border-right border-gray-200 z-40 transition-all duration-300 shadow-xl ${isOpen ? 'w-64' : 'w-20'}`}
              >
                     <div className="h-16 flex items-center justify-center border-bottom border-gray-100 px-4">
                            <Link href={route(homeRoute)} className="flex items-center gap-2">
                                   <img src="/assets/images/header-logo.png" alt="Logo" className={`${isOpen ? 'h-10' : 'h-8'} transition-all`} />
                            </Link>
                     </div>

                     <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
                            {visibleMenuItems.map((item, index) => {
                                   if (item.type === 'divider') {
                                          return isOpen ? (
                                                 <div key={index} className="px-3 pt-4 pb-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t(item.label)}</span>
                                                 </div>
                                          ) : <div key={index} className="h-px bg-gray-100 my-4 mx-2" />;
                                   }

                                   const isActive = item.route && (route().current(item.route) || url.startsWith(route(item.route).split('?')[0]));

                                   return (
                                          <Link
                                                 key={index}
                                                 href={item.route ? route(item.route) : '#'}
                                                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive
                                                        ? 'bg-black text-white shadow-lg shadow-black/20'
                                                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                                        }`}
                                          >
                                                 <div className={`flex items-center justify-center transition-all ${isOpen ? 'w-6' : 'w-full'}`}>
                                                        <i className={`fa-solid ${item.icon} ${isOpen ? 'text-sm' : 'text-lg'}`}></i>
                                                 </div>

                                                 {isOpen && (
                                                        <span className="text-sm font-semibold truncate">{t(item.name)}</span>
                                                 )}

                                                 {!isOpen && (
                                                        <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                               {t(item.name)}
                                                        </div>
                                                 )}
                                          </Link>
                                   );
                            })}
                     </nav>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `}} />
              </aside>
       );
}
