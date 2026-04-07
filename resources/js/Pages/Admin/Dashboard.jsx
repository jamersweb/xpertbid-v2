import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
       const monthLabels = Array.from({ length: 12 }, (_, index) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (11 - index));
              return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
       });

       const buildSparkline = (values = []) => {
              if (!values.length) {
                     return {
                            linePath: 'M0,60 L260,60',
                            areaPath: 'M0,60 L260,60 L260,60 L0,60 Z',
                            points: [],
                     };
              }

              const max = Math.max(...values, 1);
              const stepX = values.length > 1 ? 260 / (values.length - 1) : 260;
              const chartPoints = values.map((value, index) => {
                     const x = index * stepX;
                     const y = 60 - ((value / max) * 42);
                     return { x, y, value, label: monthLabels[index] || `Month ${index + 1}` };
              });

              const linePath = chartPoints.map((point, index) => {
                     return `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
              }).join(' ');

              return {
                     linePath,
                     areaPath: `${linePath} L260,60 L0,60 Z`,
                     points: chartPoints,
              };
       };

       const cards = [
              { key: 'total_users', label: 'Total Users', value: stats.total_users, line: '#5B5BF7', fill: 'rgba(91, 91, 247, 0.12)' },
              { key: 'total_products', label: 'Total Products', value: stats.total_products, line: '#10B981', fill: 'rgba(16, 185, 129, 0.12)' },
              { key: 'auction_listings', label: 'Auction Listings', value: stats.auction_listings, line: '#F59E0B', fill: 'rgba(245, 158, 11, 0.14)' },
              { key: 'normal_listings', label: 'Normal Listings', value: stats.normal_listings, line: '#EC4899', fill: 'rgba(236, 72, 153, 0.12)' },
              { key: 'verified_users', label: 'Verified Users', value: stats.verified_users, line: '#3B82F6', fill: 'rgba(59, 130, 246, 0.12)' },
              { key: 'total_bids', label: 'Total Bids', value: stats.total_bids, line: '#7C3AED', fill: 'rgba(124, 58, 237, 0.12)' },
       ];

       const lastCurrencySync = stats.currency_last_synced_at
              ? new Date(stats.currency_last_synced_at).toLocaleString()
              : 'Not synced yet';
       const lastAuctionStatusCheck = stats.auction_status_last_checked_at
              ? new Date(stats.auction_status_last_checked_at).toLocaleString()
              : 'Not checked yet';

       return (
              <AdminLayout title="Dashboard">
                     <Head title="Admin Dashboard" />

                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {cards.map((card, index) => (
                                   <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-3">{card.label}</h3>
                                          <p className="text-[44px] leading-none font-black text-gray-900 tracking-tight mb-4">{card.value}</p>
                                          <div className="mt-4">
                                                 {(() => {
                                                        const { linePath, areaPath, points } = buildSparkline(stats.series?.[card.key] || []);
                                                        return (
                                                 <svg viewBox="0 0 260 68" className="w-full h-14 overflow-visible" preserveAspectRatio="none">
                                                        <path
                                                               d={areaPath}
                                                               fill={card.fill}
                                                        />
                                                        <path
                                                               d={linePath}
                                                               fill="none"
                                                               stroke={card.line}
                                                               strokeWidth="2.5"
                                                               strokeLinecap="round"
                                                        />
                                                        {points.map((point, pointIndex) => (
                                                               <g key={pointIndex}>
                                                                      <circle
                                                                             cx={point.x}
                                                                             cy={point.y}
                                                                             r="4"
                                                                             fill={card.line}
                                                                             className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                                                      >
                                                                             <title>{`${point.label}: ${point.value}`}</title>
                                                                      </circle>
                                                               </g>
                                                        ))}
                                                 </svg>
                                                        );
                                                 })()}
                                          </div>
                                   </div>
                            ))}
                     </div>

                     <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                   <h3 className="text-lg font-bold text-gray-800 mb-3">Currency Sync</h3>
                                   <p className="text-sm text-gray-500 mb-2">Last successful currency rates sync</p>
                                   <p className="text-xl font-black text-gray-800">{lastCurrencySync}</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                   <h3 className="text-lg font-bold text-gray-800 mb-3">Auction Status Check</h3>
                                   <p className="text-sm text-gray-500 mb-2">Last successful auction status scan</p>
                                   <p className="text-xl font-black text-gray-800">{lastAuctionStatusCheck}</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                                   <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
                                   <div className="flex flex-col gap-4">
                                          <p className="text-gray-400 italic text-sm">Activity feed coming soon...</p>
                                   </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                                   <h3 className="text-lg font-bold text-gray-800 mb-6">Market Trends</h3>
                                   <div className="flex flex-col gap-4">
                                          <p className="text-gray-400 italic text-sm">Real-time charts coming soon...</p>
                                   </div>
                            </div>
                     </div>
              </AdminLayout>
       );
}
