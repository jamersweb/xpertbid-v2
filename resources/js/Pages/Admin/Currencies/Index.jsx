import React, { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ currencies = [], currencyLastSyncedAt }) {
       const formattedCurrencySyncTime = useMemo(() => {
              if (!currencyLastSyncedAt) return 'Not synced yet';
              return new Date(currencyLastSyncedAt).toLocaleString();
       }, [currencyLastSyncedAt]);

       const deleteCurrency = (currency) => {
              if (!window.confirm(`Delete ${currency.code}?`)) return;
              router.delete(route('admin.currencies.destroy', currency.id), { preserveScroll: true });
       };

       return (
              <AdminLayout title="Currencies">
                     <Head title="Currencies" />

                     <div className="space-y-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                                   <div className="flex flex-wrap items-center justify-between gap-4">
                                          <div className="min-w-[260px]">
                                                 <h2 className="text-2xl font-bold text-gray-950 mb-1">Currencies</h2>
                                                 <p className="text-sm text-gray-500">Manage currency symbols, rates, formats, and availability.</p>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-3">
                                                 <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3">
                                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm">
                                                               <i className="fa-solid fa-rotate text-xs"></i>
                                                        </span>
                                                        <div className="leading-tight">
                                                               <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-600">Last Sync</span>
                                                               <span className="block text-xs font-semibold text-gray-900">{formattedCurrencySyncTime}</span>
                                                        </div>
                                                 </div>
                                                 <Link href={route('admin.currencies.create')} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-colors">
                                                        <i className="fa-solid fa-plus text-xs"></i>
                                                        Add Currency
                                                 </Link>
                                          </div>
                                   </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                   <div className="overflow-x-auto">
                                          <table className="w-full text-left border-collapse">
                                                 <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                                               <th className="px-6 py-4 align-middle">Currency</th>
                                                               <th className="px-6 py-4 align-middle">Symbol</th>
                                                               <th className="px-6 py-4 align-middle">Rate</th>
                                                               <th className="px-6 py-4 align-middle">Format</th>
                                                               <th className="px-6 py-4 align-middle">Status</th>
                                                               <th className="px-6 py-4 align-middle text-right">Actions</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-gray-100">
                                                        {currencies.map((currency) => (
                                                               <tr key={currency.id} className="hover:bg-slate-50/70 transition-colors">
                                                                      <td className="px-6 py-4">
                                                                             <div className="flex items-center gap-3">
                                                                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-900">
                                                                                           {currency.code}
                                                                                    </span>
                                                                                    <div>
                                                                                           <p className="text-sm font-bold text-gray-900">{currency.code}</p>
                                                                                           <p className="text-xs text-gray-500">{currency.name}</p>
                                                                                    </div>
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="inline-flex min-w-10 justify-center rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-bold text-gray-900">
                                                                                    {currency.symbol}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="font-mono text-sm text-gray-800">{currency.manual_rate_to_aed || 'N/A'}</span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <div className="text-xs font-medium text-gray-700 capitalize">
                                                                                    {currency.decimals} decimals
                                                                             </div>
                                                                             <div className="text-xs text-gray-500 capitalize">
                                                                                    Symbol {currency.position}
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className={`inline-flex min-w-[82px] justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${currency.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                                    {currency.enabled ? 'Enabled' : 'Disabled'}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <div className="flex justify-end gap-2">
                                                                                    <Link href={route('admin.currencies.edit', currency.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors" title="Edit currency">
                                                                                           <i className="fa-solid fa-pen"></i>
                                                                                    </Link>
                                                                                    <button type="button" onClick={() => deleteCurrency(currency)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Delete currency">
                                                                                           <i className="fa-solid fa-trash"></i>
                                                                                    </button>
                                                                             </div>
                                                                      </td>
                                                               </tr>
                                                        ))}
                                                        {!currencies.length && (
                                                               <tr>
                                                                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                                                             No currencies found.
                                                                      </td>
                                                               </tr>
                                                        )}
                                                 </tbody>
                                          </table>
                                   </div>
                            </div>
                     </div>
              </AdminLayout>
       );
}
