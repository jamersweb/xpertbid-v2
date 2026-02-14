import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import AddMoneyModal from './Components/AddMoneyModal';
import PayoutModal from './Components/PayoutModal';

export default function Index({ balance, transactions }) {
       const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
       const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

       return (
              <AppLayout title="My Wallet">
                     <Head title="My Wallet" />

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="row justify-content-center">
                                          <div className="col-lg-11">
                                                 <h1 className="h2 fw-bold text-dark mb-4 px-2">My Wallet</h1>

                                                 <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                                                        <div className="card-body p-4 p-md-5 bg-white">
                                                               <div className="row align-items-center">
                                                                      <div className="col-md-6 mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
                                                                             <span className="text-secondary small fw-bold text-uppercase tracking-wider mb-2">Available Balance</span>
                                                                             <div className="d-flex align-items-baseline">
                                                                                    <span className="h1 fw-black text-dark mb-0 me-2" style={{ fontSize: '3.5rem' }}>
                                                                                           <Price amountAED={balance} />
                                                                                    </span>
                                                                             </div>
                                                                      </div>
                                                                      <div className="col-md-6">
                                                                             <div className="d-flex flex-column flex-sm-row gap-3 justify-content-md-end">
                                                                                    <button
                                                                                           onClick={() => setIsAddMoneyModalOpen(true)}
                                                                                           className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                                                    >
                                                                                           <i className="fa-solid fa-plus-circle"></i> Add Money
                                                                                    </button>
                                                                                    <button
                                                                                           onClick={() => setIsPayoutModalOpen(true)}
                                                                                           className="btn btn-outline-primary btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                                                    >
                                                                                           <i className="fa-solid fa-money-bill-transfer"></i> Get Paid
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="card border-0 shadow-sm rounded-4">
                                                        <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between">
                                                               <h3 className="h5 fw-bold text-dark mb-0">Recent Transactions</h3>
                                                               <Link href="/payment-requests" className="btn btn-link text-primary text-decoration-none fw-bold small">
                                                                      View Payout Requests
                                                               </Link>
                                                        </div>
                                                        <div className="card-body p-0">
                                                               <div className="table-responsive">
                                                                      <table className="table table-hover mb-0">
                                                                             <thead className="bg-light">
                                                                                    <tr>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Description</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Amount</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Type</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Status</th>
                                                                                           <th className="px-4 py-3 border-0 text-secondary small fw-bold text-uppercase">Date</th>
                                                                                    </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                                    {transactions.data.length === 0 ? (
                                                                                           <tr>
                                                                                                  <td colSpan="5" className="text-center py-5">
                                                                                                         <p className="text-muted m-0">No transactions yet.</p>
                                                                                                  </td>
                                                                                           </tr>
                                                                                    ) : (
                                                                                           transactions.data.map((tx) => (
                                                                                                  <tr key={tx.id}>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className="fw-medium text-dark">{tx.description}</span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className={`fw-bold ${tx.type === 'add' ? 'text-success' : 'text-danger'}`}>
                                                                                                                       {tx.type === 'add' ? '+' : '-'} <Price amountAED={tx.amount} />
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className="badge bg-light text-dark text-capitalize px-3 rounded-pill border">
                                                                                                                       {tx.type}
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0">
                                                                                                                <span className={`badge rounded-pill px-3 ${tx.status === 'completed' ? 'bg-success-soft text-success' :
                                                                                                                              tx.status === 'pending' ? 'bg-warning-soft text-warning' :
                                                                                                                                     'bg-danger-soft text-danger'
                                                                                                                       }`}>
                                                                                                                       {tx.status}
                                                                                                                </span>
                                                                                                         </td>
                                                                                                         <td className="px-4 py-3 border-0 text-muted small">
                                                                                                                {new Date(tx.created_at).toLocaleDateString()}
                                                                                                         </td>
                                                                                                  </tr>
                                                                                           ))
                                                                                    )}
                                                                             </tbody>
                                                                      </table>
                                                               </div>
                                                        </div>
                                                        <div className="card-footer bg-white border-0 py-3 px-4">
                                                               {/* Pagination links */}
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <AddMoneyModal
                            isOpen={isAddMoneyModalOpen}
                            onClose={() => setIsAddMoneyModalOpen(false)}
                     />

                     <PayoutModal
                            isOpen={isPayoutModalOpen}
                            onClose={() => setIsPayoutModalOpen(false)}
                            balance={balance}
                     />

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .bg-success-soft { background-color: rgba(40, 167, 69, 0.1); }
                .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
                .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
                .tracking-wider { letter-spacing: 0.1em; }
            `}} />
              </AppLayout>
       );
}
