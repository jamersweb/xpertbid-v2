import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function AddMoneyModal({ isOpen, onClose }) {
       const { data, setData, post, processing, errors, reset } = useForm({
              amount: '',
              payment_method: 'stripe',
       });

       const submit = (e) => {
              e.preventDefault();
              post(route('wallet.add'), {
                     onSuccess: () => {
                            reset();
                            onClose();
                     },
              });
       };

       return (
              <Modal show={isOpen} onClose={onClose} maxWidth="md">
                     <div className="p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                   <h2 className="h4 fw-bold m-0 text-dark">Add Money to Wallet</h2>
                                   <button onClick={onClose} className="btn-close"></button>
                            </div>

                            <form onSubmit={submit}>
                                   <div className="mb-4">
                                          <label className="form-label fw-bold small text-muted text-uppercase">Amount (PKR)</label>
                                          <div className="input-group input-group-lg shadow-sm border rounded-3 overflow-hidden">
                                                 <span className="input-group-text border-0 bg-white">PKR</span>
                                                 <input
                                                        type="number"
                                                        className="form-control border-0"
                                                        value={data.amount}
                                                        onChange={(e) => setData('amount', e.target.value)}
                                                        placeholder="0.00"
                                                        required
                                                 />
                                          </div>
                                          {errors.amount && <div className="text-danger small mt-1">{errors.amount}</div>}
                                   </div>

                                   <div className="mb-4">
                                          <label className="form-label fw-bold small text-muted text-uppercase">Payment Method</label>
                                          <div className="row g-2">
                                                 {['stripe', 'paypal', 'bank_transfer'].map((method) => (
                                                        <div className="col-4" key={method}>
                                                               <input
                                                                      type="radio"
                                                                      className="btn-check"
                                                                      name="payment_method"
                                                                      id={`method-${method}`}
                                                                      value={method}
                                                                      checked={data.payment_method === method}
                                                                      onChange={(e) => setData('payment_method', e.target.value)}
                                                                      autoComplete="off"
                                                               />
                                                               <label className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center gap-2 border rounded-3" htmlFor={`method-${method}`}>
                                                                      <i className={`fa-solid ${method === 'stripe' ? 'fa-credit-card' : method === 'paypal' ? 'fa-brands fa-paypal' : 'fa-building-columns'} fs-5`}></i>
                                                                      <span className="small fw-bold text-capitalize">{method.replace('_', ' ')}</span>
                                                               </label>
                                                        </div>
                                                 ))}
                                          </div>
                                          {errors.payment_method && <div className="text-danger small mt-1">{errors.payment_method}</div>}
                                   </div>

                                   <div className="mt-5 d-grid">
                                          <button
                                                 type="submit"
                                                 className="btn btn-primary btn-lg rounded-pill fw-bold py-3 shadow"
                                                 disabled={processing}
                                          >
                                                 {processing ? 'Processing...' : 'Confirm Deposit'}
                                          </button>
                                   </div>
                            </form>
                     </div>
              </Modal>
       );
}
