import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ invoices }) => {
       const getStatusClass = (status) => {
              switch (status) {
                     case "Paid":
                            return "invoice-status-paid";
                     case "In Progress":
                            return "invoice-status-inprogress";
                     case "Rejected":
                            return "invoice-status-rejected";
                     default:
                            return "";
              }
       };

       return (
              <AppLayout>
                     <Head title="My Invoices" />
                     <section className="invoices py-10">
                            <div className="container mx-auto px-4">
                                   <div className="invoices-main-heading mb-6">
                                          <h2 className="text-2xl font-bold">My Invoices</h2>
                                   </div>

                                   <div className="invoices-table overflow-x-auto bg-white rounded-lg shadow">
                                          <table className="min-w-full divide-y divide-gray-200">
                                                 <thead className="bg-gray-50">
                                                        <tr>
                                                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                      Invoice #
                                                               </th>
                                                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                      Amount
                                                               </th>
                                                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                      Description
                                                               </th>
                                                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                      Date
                                                               </th>
                                                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                      Status
                                                               </th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="bg-white divide-y divide-gray-200">
                                                        {invoices.length > 0 ? (
                                                               invoices.map((invoice) => (
                                                                      <tr key={invoice.id}>
                                                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                    {invoice.id}
                                                                             </td>
                                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                    ${invoice.final_cost}
                                                                             </td>
                                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                    {invoice.booking ? invoice.booking.cargo_type : 'N/A'}
                                                                             </td>
                                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                    {new Date(invoice.created_at).toLocaleDateString('en-US', {
                                                                                           year: 'numeric',
                                                                                           month: 'short',
                                                                                           day: 'numeric',
                                                                                    })}
                                                                             </td>
                                                                             <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                                                                           {invoice.status}
                                                                                    </span>
                                                                             </td>
                                                                      </tr>
                                                               ))
                                                        ) : (
                                                               <tr>
                                                                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                                             No invoices found.
                                                                      </td>
                                                               </tr>
                                                        )}
                                                 </tbody>
                                          </table>
                                   </div>
                            </div>
                     </section>

                     <style jsx>{`
                .invoice-status-paid {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .invoice-status-inprogress {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                .invoice-status-rejected {
                    background-color: #fee2e2;
                    color: #991b1b;
                }
            `}</style>
              </AppLayout>
       );
};

export default Index;
