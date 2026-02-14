import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ order }) {
       const [status, setStatus] = useState(order.status);

       const handleStatusUpdate = (newStatus) => {
              router.patch(route('admin.orders.update-status', order.id), {
                     status: newStatus
              }, {
                     onSuccess: () => setStatus(newStatus)
              });
       };

       return (
              <AdminLayout title={`Order Details #${order.order_number}`}>
                     <Head title={`Order #${order.order_number}`} />

                     <div className="mb-6 flex items-center justify-between">
                            <Link href={route('admin.orders.index')} className="flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                   <i className="fa-solid fa-arrow-left mr-2"></i> Back to Orders
                            </Link>
                            <div className="flex gap-3">
                                   <select
                                          className="bg-white border-gray-200 focus:ring-black rounded-xl text-sm font-bold"
                                          value={status}
                                          onChange={(e) => handleStatusUpdate(e.target.value)}
                                   >
                                          <option value="pending">Pending</option>
                                          <option value="processing">Processing</option>
                                          <option value="completed">Completed</option>
                                          <option value="cancelled">Cancelled</option>
                                   </select>
                            </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                   {/* Items Table */}
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                          <div className="p-6 border-bottom border-gray-100 font-bold text-gray-800">Order Items</div>
                                          <div className="p-6">
                                                 <table className="w-full text-left">
                                                        <thead className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                                               <tr>
                                                                      <th className="pb-4">Product</th>
                                                                      <th className="pb-4">Price</th>
                                                                      <th className="pb-4">Qty</th>
                                                                      <th className="pb-4 text-right">Total</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                               {order.items.map((item) => (
                                                                      <tr key={item.id}>
                                                                             <td className="py-4">
                                                                                    <div className="flex items-center gap-3">
                                                                                           <img src={item.auction?.image_url || '/images/placeholder.png'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                                                           <div>
                                                                                                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.auction?.title}</p>
                                                                                                  {item.variation && <p className="text-[10px] text-gray-400">Var: {item.variation.name}</p>}
                                                                                           </div>
                                                                                    </div>
                                                                             </td>
                                                                             <td className="py-4 text-sm">AED {item.price}</td>
                                                                             <td className="py-4 text-sm">{item.quantity}</td>
                                                                             <td className="py-4 text-sm text-right font-bold">AED {item.subtotal}</td>
                                                                      </tr>
                                                               ))}
                                                        </tbody>
                                                 </table>
                                          </div>
                                          <div className="p-6 bg-gray-50/50 border-top border-gray-100 space-y-2">
                                                 <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span> <span className="font-medium text-gray-800">AED {order.subtotal}</span></div>
                                                 <div className="flex justify-between text-sm text-gray-500"><span>Tax</span> <span className="font-medium text-gray-800">AED {order.tax}</span></div>
                                                 <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span> <span className="font-medium text-gray-800">AED {order.shipping_cost}</span></div>
                                                 <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total</span> <span className="text-black">AED {order.total}</span></div>
                                          </div>
                                   </div>

                                   {/* Receipt Image */}
                                   {order.receipt_image && (
                                          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                                 <div className="p-6 border-bottom border-gray-100 font-bold text-gray-800">Payment Receipt</div>
                                                 <div className="p-6 flex justify-center">
                                                        <img
                                                               src={order.receipt_image}
                                                               className="max-w-full rounded-xl border border-gray-100 shadow-sm"
                                                               alt="Payment Receipt"
                                                               onClick={() => window.open(order.receipt_image)}
                                                        />
                                                 </div>
                                          </div>
                                   )}
                            </div>

                            <div className="space-y-6">
                                   {/* Customer Info */}
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Customer Details</h3>
                                          <div className="flex items-center gap-3 mb-4">
                                                 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">{order.user?.name?.charAt(0)}</div>
                                                 <div>
                                                        <p className="text-sm font-bold text-gray-800">{order.user?.name}</p>
                                                        <p className="text-[10px] text-gray-500">{order.user?.email}</p>
                                                 </div>
                                          </div>
                                          <div className="space-y-3">
                                                 <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Billing Address</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                               {order.billing_address_line1}<br />
                                                               {order.billing_address_line2 && <>{order.billing_address_line2}<br /></>}
                                                               {order.billing_city}, {order.billing_state} {order.billing_postal_code}<br />
                                                               {order.billing_country}
                                                        </p>
                                                 </div>
                                                 <div className="border-t pt-3">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Shipping Address</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                               {order.shipping_name}<br />
                                                               {order.shipping_address_line1}<br />
                                                               {order.shipping_city}, {order.shipping_country}
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>

                                   {/* Transaction Details */}
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Transaction</h3>
                                          <div className="space-y-4">
                                                 <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500 font-medium">Payment Method</span>
                                                        <span className="text-xs font-bold text-gray-800 capitalize">{order.payment_method?.replace('_', ' ')}</span>
                                                 </div>
                                                 <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500 font-medium">Transaction ID</span>
                                                        <span className="text-xs font-mono text-gray-600">#{order.transaction_id || 'N/A'}</span>
                                                 </div>
                                                 <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500 font-medium">Payment Status</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                               {order.payment_status}
                                                        </span>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </AdminLayout>
       );
}
