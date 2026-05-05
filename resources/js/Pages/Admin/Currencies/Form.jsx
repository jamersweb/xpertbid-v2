import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const formInputClass = 'w-full px-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400';

export default function Form({ currency = null }) {
       const isEditing = Boolean(currency);
       const { data, setData, post, put, processing, errors } = useForm({
              code: currency?.code || '',
              name: currency?.name || '',
              symbol: currency?.symbol || '',
              manual_rate_to_aed: currency?.manual_rate_to_aed || '',
              decimals: currency?.decimals ?? 2,
              position: currency?.position || 'left',
              enabled: currency?.enabled ?? true,
       });

       const submit = (e) => {
              e.preventDefault();

              if (isEditing) {
                     put(route('admin.currencies.update', currency.id));
                     return;
              }

              post(route('admin.currencies.store'));
       };

       return (
              <AdminLayout title={isEditing ? `Edit ${currency.code}` : 'Create Currency'}>
                     <Head title={isEditing ? `Edit ${currency.code}` : 'Create Currency'} />

                     <div className="max-w-4xl mx-auto">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                   <div>
                                          <h3 className="text-xl font-bold text-gray-900">{isEditing ? `Edit ${currency.code}` : 'Create Currency'}</h3>
                                          <p className="text-sm text-gray-500 mt-1">Set currency code, symbol, rate, format, and availability.</p>
                                   </div>
                                   <Link href={route('admin.currencies.index')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-200 transition-colors">
                                          <i className="fa-solid fa-arrow-left"></i>
                                          Back
                                   </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                   <form onSubmit={submit} className="p-6 space-y-5">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                 <div>
                                                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Code</label>
                                                        <input
                                                               className={`${formInputClass} font-bold uppercase`}
                                                               value={data.code}
                                                               maxLength={3}
                                                               placeholder="USD"
                                                               onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                        />
                                                        {errors.code && <p className="mt-1 text-xs text-rose-500">{errors.code}</p>}
                                                 </div>

                                                 <div>
                                                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Symbol</label>
                                                        <input
                                                               className={formInputClass}
                                                               value={data.symbol}
                                                               placeholder="$"
                                                               onChange={(e) => setData('symbol', e.target.value)}
                                                        />
                                                        {errors.symbol && <p className="mt-1 text-xs text-rose-500">{errors.symbol}</p>}
                                                 </div>
                                          </div>

                                          <div>
                                                 <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Name</label>
                                                 <input
                                                        className={formInputClass}
                                                        value={data.name}
                                                        placeholder="US Dollar"
                                                        onChange={(e) => setData('name', e.target.value)}
                                                 />
                                                 {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                          </div>

                                          <div>
                                                 <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Rate</label>
                                                 <input
                                                        type="number"
                                                        step="0.00000001"
                                                        min="0"
                                                        className={formInputClass}
                                                        value={data.manual_rate_to_aed}
                                                        placeholder="1.00000000"
                                                        onChange={(e) => setData('manual_rate_to_aed', e.target.value)}
                                                 />
                                                 {errors.manual_rate_to_aed && <p className="mt-1 text-xs text-rose-500">{errors.manual_rate_to_aed}</p>}
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                 <div>
                                                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Decimals</label>
                                                        <input
                                                               type="number"
                                                               min="0"
                                                               max="8"
                                                               className={formInputClass}
                                                               value={data.decimals}
                                                               onChange={(e) => setData('decimals', e.target.value)}
                                                        />
                                                        {errors.decimals && <p className="mt-1 text-xs text-rose-500">{errors.decimals}</p>}
                                                 </div>

                                                 <div>
                                                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Position</label>
                                                        <select
                                                               className={formInputClass}
                                                               value={data.position}
                                                               onChange={(e) => setData('position', e.target.value)}
                                                        >
                                                               <option value="left">Left</option>
                                                               <option value="right">Right</option>
                                                        </select>
                                                        {errors.position && <p className="mt-1 text-xs text-rose-500">{errors.position}</p>}
                                                 </div>
                                          </div>

                                          <label className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 cursor-pointer">
                                                 <span className="text-sm font-semibold text-gray-900">Enabled</span>
                                                 <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                                                        checked={data.enabled}
                                                        onChange={(e) => setData('enabled', e.target.checked)}
                                                 />
                                          </label>

                                          <div className="flex justify-end gap-3 pt-2">
                                                 <Link href={route('admin.currencies.index')} className="inline-flex items-center justify-center rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-200 transition-colors">
                                                        Cancel
                                                 </Link>
                                                 <button type="submit" disabled={processing} className="inline-flex min-w-[170px] items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-50">
                                                        {processing ? 'Saving...' : (isEditing ? 'Update Currency' : 'Create Currency')}
                                                 </button>
                                          </div>
                                   </form>
                            </div>
                     </div>
              </AdminLayout>
       );
}
