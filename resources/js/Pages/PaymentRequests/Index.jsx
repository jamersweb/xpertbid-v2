import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';

export default function Index({ requests }) {
       return (
              <AppLayout title="Payment Requests">
                     <Head title="Payment Requests" />

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="row justify-content-center">
                                          <div className="col-lg-10">
                                                 <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className="h2 fw-bold text-dark m-0">My Payment Requests</h1>
                                                        <Link href="/wallet" className="btn btn-outline-dark rounded-pill px-4 btn-sm">
                                                               <i className="fa-solid fa-arrow-left me-2"></i> Back to Wallet
                                                        </Link>
                                                 </div>

                                                 <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                                        <div className="card-body p-0">
                                                               <div className="table-responsive">
                                                                      <table className="table table-hover mb-0">
                                                                             <thead className="bg-light">
                                                                                    <tr>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Amount</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Payment Method</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Status</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Date</th>
                                                                                    </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                                    {requests.data.length === 0 ? (
                                                                                           <tr>
                                                                                                  <td colSpan="4" className="text-center py-5">
                                                                                                         <div className="mb-3 opacity-25">
                                                                                                                <i className="fa-solid fa-receipt fa-3x"></i>
                                                                                                         </div>
                                                                                                         <p className="text-muted m-0">No payment requests found.</p>
                                                                                                  </td>
                                                                                           </tr>
                                                                                    ) : (
                                                                                           requests.data.map((request) => (
                                                                                                  <tr key={request.id}>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className="fw-bold text-dark">
                                                                                                                       <Price amountAED={request.amount} />
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className="text-secondary small">
                                                                                                                       {request.payment_method?.paymentMethod || "Direct Transfer"}
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className={`badge rounded-pill px-3 ${request.status === 'completed' || request.status === 'approved' ? 'bg-success-soft text-success' :
                                                                                                                              request.status === 'pending' || request.status === 'processing' ? 'bg-warning-soft text-warning' :
                                                                                                                                     'bg-danger-soft text-danger'
                                                                                                                       }`}>
                                                                                                                       {request.status}
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0 text-muted small">
                                                                                                                {new Date(request.created_at).toLocaleDateString()}
                                                                                                         </td>
                                                                                                  </tr>
                                                                                           ))
                                                                                    )}
                                                                             </tbody>
                                                                      </table>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .bg-success-soft { background-color: rgba(40, 167, 69, 0.1); }
                .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
                .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
            `}} />
              </AppLayout>
       );
}
