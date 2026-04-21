import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import useTranslate from '@/hooks/useTranslate';

export default function Index({ requests }) {
       const { t } = useTranslate();

       const statusStyles = (status) => {
              if (status === 'completed' || status === 'approved') {
                     return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#065f46', border: '1px solid rgba(16, 185, 129, 0.3)' };
              } else if (status === 'pending' || status === 'processing') {
                     return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#92400e', border: '1px solid rgba(245, 158, 11, 0.3)' };
              }
              return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#991b1b', border: '1px solid rgba(239, 68, 68, 0.3)' };
       };

       return (
              <AppLayout title={t('Payment Requests')}>
                     <Head title={t('Payment Requests')} />

                     <div style={{ padding: '50px 0', minHeight: '70vh', backgroundColor: '#fff' }}>
                            <div className="container">
                                   <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#23262F', margin: '0 0 32px 0' }}>
                                          {t('My Payment Requests')}
                                   </h1>

                                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                          <thead>
                                                 <tr style={{ borderBottom: '2px solid #E6E8EC' }}>
                                                        <th style={{ padding: '14px 0', fontWeight: '700', color: '#23262F', fontSize: '15px', textAlign: 'left' }}>{t('Amount')}</th>
                                                        <th style={{ padding: '14px 0', fontWeight: '700', color: '#23262F', fontSize: '15px', textAlign: 'left' }}>{t('Payment Method')}</th>
                                                        <th style={{ padding: '14px 0', fontWeight: '700', color: '#23262F', fontSize: '15px', textAlign: 'left' }}>{t('Status')}</th>
                                                 </tr>
                                          </thead>
                                          <tbody>
                                                 {requests.data.length === 0 ? (
                                                        <tr>
                                                               <td colSpan="3" style={{ padding: '20px 0', color: '#353945', fontSize: '15px', fontWeight: '500' }}>
                                                                      {t('No payment requests found.')}
                                                               </td>
                                                        </tr>
                                                 ) : (
                                                        requests.data.map((request) => (
                                                               <tr key={request.id} style={{ borderBottom: '1px solid #E6E8EC' }}>
                                                                      <td style={{ padding: '16px 0', fontWeight: '700', color: '#23262F', fontSize: '16px' }}>
                                                                             <Price amountAED={request.amount} />
                                                                      </td>
                                                                      <td style={{ padding: '16px 0', color: '#353945', fontSize: '15px' }}>
                                                                             {request.payment_method?.paymentMethod || t('Direct Transfer')}
                                                                      </td>
                                                                      <td style={{ padding: '16px 0' }}>
                                                                             <span style={{
                                                                                    padding: '5px 14px',
                                                                                    borderRadius: '50px',
                                                                                    fontSize: '13px',
                                                                                    fontWeight: '600',
                                                                                    textTransform: 'capitalize',
                                                                                    ...statusStyles(request.status)
                                                                             }}>
                                                                                    {request.status}
                                                                             </span>
                                                                      </td>
                                                               </tr>
                                                        ))
                                                 )}
                                          </tbody>
                                   </table>

                                   {requests.links && requests.links.length > 3 && (
                                          <div className="d-flex justify-content-center mt-5">
                                                 <nav>
                                                        <ul className="pagination gap-1">
                                                               {requests.links.map((link, i) => (
                                                                      <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                                             <Link
                                                                                    href={link.url || '#'}
                                                                                    className="page-link rounded-3"
                                                                                    style={{
                                                                                           background: link.active ? '#23262F' : '#fff',
                                                                                           color: link.active ? '#fff' : '#23262F',
                                                                                           border: '1px solid #E6E8EC',
                                                                                           fontWeight: '600'
                                                                                    }}
                                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                             />
                                                                      </li>
                                                               ))}
                                                        </ul>
                                                 </nav>
                                          </div>
                                   )}
                            </div>
                     </div>
              </AppLayout>
       );
}
