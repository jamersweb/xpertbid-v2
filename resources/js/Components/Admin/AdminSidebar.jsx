import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const menuItems = [
       { name: 'Dashboard', icon: 'fa-gauge-high', route: 'admin.dashboard' },
       { name: 'Auctions', icon: 'fa-gavel', route: 'admin.auctions.index' },
       { name: 'Bids', icon: 'fa-hand-holding-dollar', route: 'admin.bids.index' },
       { name: 'Orders', icon: 'fa-cart-shopping', route: 'admin.orders.index' },
       { type: 'divider', label: 'Verifications' },
       { name: 'Auctions Approval', icon: 'fa-clipboard-check', route: 'admin.verifications.auctions.index' },
       { name: 'Individual', icon: 'fa-user-check', route: 'admin.verifications.individual.index' },
       { name: 'Corporate', icon: 'fa-building-circle-check', route: 'admin.verifications.corporate.index' },
       { name: 'Vehicles', icon: 'fa-car-side', route: 'admin.verifications.vehicle.index' },
       { name: 'Properties', icon: 'fa-house-circle-check', route: 'admin.verifications.property.index' },
       { type: 'divider', label: 'Management' },
       { name: 'Users', icon: 'fa-users', route: 'admin.users.index' },
       { name: 'Payments', icon: 'fa-money-bill-transfer', route: 'admin.payment-requests.index' },
       { name: 'Categories', icon: 'fa-layer-group', route: 'admin.auction_categories.index' },
       { name: 'Blogs', icon: 'fa-newspaper', route: 'admin.blogs.index' },
       { type: 'divider', label: 'Site Content' },
       { name: 'Sliders', icon: 'fa-images', route: 'admin.sliders.index' },
       { name: 'FAQs', icon: 'fa-circle-question', route: 'admin.faqs.index' },
       { type: 'divider', label: 'System' },
       { name: 'General Settings', icon: 'fa-gears', route: 'admin.master-settings.index' },
       { name: 'Locations', icon: 'fa-location-dot', route: 'admin.locations.index' },
       { type: 'divider', label: 'Tools' },
       { name: 'SEO', icon: 'fa-magnifying-glass-chart', route: 'admin.seo.index' },
       { name: 'Bidder Messaging', icon: 'fa-message', route: 'admin.bidder-communication.index' },
       { name: 'CRM (Outreach)', icon: 'fa-people-arrows', route: 'admin.crm.index' },
       { name: 'Email Logs', icon: 'fa-envelope-open-text', route: 'admin.email-logs.index' },
       { name: 'Roles & Permissions', icon: 'fa-user-shield', route: 'admin.roles.index' },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
       const { url } = usePage();

       return (
              <aside
                     className={`fixed left-0 top-0 h-screen bg-white border-right border-gray-200 z-40 transition-all duration-300 shadow-xl ${isOpen ? 'w-64' : 'w-20'}`}
              >
                     <div className="h-16 flex items-center justify-center border-bottom border-gray-100 px-4">
                            <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                                   <img src="/images/header-logo.png" alt="Logo" className={`${isOpen ? 'h-10' : 'h-8'} transition-all`} />
                                   {isOpen && <span className="font-bold text-lg tracking-tight">ADMIN</span>}
                            </Link>
                     </div>

                     <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
                            {menuItems.map((item, index) => {
                                   if (item.type === 'divider') {
                                          return isOpen ? (
                                                 <div key={index} className="px-3 pt-4 pb-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
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
                                                        <span className="text-sm font-semibold truncate">{item.name}</span>
                                                 )}

                                                 {!isOpen && (
                                                        <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                               {item.name}
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
