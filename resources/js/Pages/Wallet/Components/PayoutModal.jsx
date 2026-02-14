import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function PayoutModal({ isOpen, onClose, balance }) {
       const { data, setData, post, processing, errors, reset } = useForm({
              amount: '',
              payment_method: 'bank_transfer',
       });

       const submit = (e) => {
              e.preventDefault();

              if (Number(data.amount) > balance) {
                     alert("Insufficient balance for this payout request.");
                     return;
              }

              post(route('payment_requests.store'), {
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
                                   <h2 className="h4 fw-bold m-0 text-dark">Request Payout</h2>
                                   <button onClick={onClose} className="btn-close"></button>
                            </div>

                            <div className="bg-light p-3 rounded-3 mb-4 text-center">
                                   <span className="text-muted small fw-bold text-uppercase">Current Balance</span>
                                   <h3 className="h4 fw-bold text-primary mb-0">PKR {Number(balance).toLocaleString()}</h3>
                            </div>

                            <form onSubmit={submit}>
                                   <div className="mb-4">
                                          <label className="form-label fw-bold small text-muted text-uppercase">Payout Amount (PKR)</label>
                                          <div className="input-group input-group-lg shadow-sm border rounded-3 overflow-hidden">
                                                 <span className="input-group-text border-0 bg-white">PKR</span>
                                                 <input
                                                        type="number"
                                                        className="form-control border-0"
                                                        value={data.amount}
                                                        onChange={(e) => setData('amount', e.target.value)}
                                                        placeholder="Min 50"
                                                        required
                                                 />
                                          </div>
                                          <div className="form-text small mt-1 text-muted">A minimum of 50 PKR is required.</div>
                                          {errors.amount && <div className="text-danger small mt-1">{errors.amount}</div>}
                                   </div>

                                   <div className="mb-4">
                                          <label className="form-label fw-bold small text-muted text-uppercase">Payment Method</label>
                                          <select
                                                 className="form-select form-select-lg border shadow-sm rounded-3"
                                                 value={data.payment_method}
                                                 onChange={(e) => setData('payment_method', e.target.value)}
                                                 required
                                          >
                                                 <option value="bank_transfer">Bank Transfer</option>
                                                 <option value="paypal">PayPal</option>
                                          </select>
                                          {errors.payment_method && <div className="text-danger small mt-1">{errors.payment_method}</div>}
                                   </div>

                                   <div className="mt-5 d-grid">
                                          <button
                                                 type="submit"
                                                 className="btn btn-dark btn-lg rounded-pill fw-bold py-3 shadow"
                                                 disabled={processing}
                                          >
                                                 {processing ? 'Processing...' : 'Submit Request'}
                                          </button>
                                   </div>
                            </form>
                     </div>
              </Modal>
       );
}
