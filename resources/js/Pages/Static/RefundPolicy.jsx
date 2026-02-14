import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import '../../../css/policy.css';

export default function RefundPolicy() {
       return (
              <AppLayout>
                     <Head title="Refund Policy" />
                     <div className="refund-policy-page">
                            <main className="policy-container policy-content">
                                   <header className="policy-hero">
                                          <p>Contents</p>
                                          <ul>
                                                 <li>Refund timelines</li>
                                                 <li>Refund types</li>
                                                 <li>Possible charges following an advanced refund or replacement order</li>
                                                 <li>Refund processing times</li>
                                                 <li>Partial refunds</li>
                                                 <li>Tax on restocking fees</li>
                                          </ul>
                                   </header>

                                   <section>
                                          <h2>Refund timelines</h2>
                                          <p>
                                                 After we receive and process your return, you’ll get a refund according to
                                                 our return policy. Refunds can take up to 30 days, depending on:
                                          </p>
                                          <ul>
                                                 <li>Order type</li>
                                                 <li>Return shipping speed</li>
                                                 <li>Processing time</li>
                                                 <li>Refund payment method</li>
                                          </ul>
                                   </section>

                                   <section>
                                          <h2>Refund types</h2>
                                          <p>
                                                 You can email us at <a href="mailto:customerservice@xpertbid.com">customerservice@xpertbid.com</a> to return most items within
                                                 30 days of delivery for a refund. We’ll offer a replacement or exchange order instead of a
                                                 refund for selected items. Types of refunds are:
                                          </p>
                                          <ul>
                                                 <li>
                                                        <strong>Advanced:</strong> We issue advanced refunds when a carrier first scans your
                                                        return, rather than when we receive and process it.
                                                 </li>
                                                 <li>
                                                        <strong>Declined:</strong> If we can’t use your original payment method (like an expired
                                                        card), refunds go to your Xpertbid account balance.
                                                 </li>
                                                 <li>
                                                        <strong>Partial:</strong> We reduce refunds for returns that are used, damaged, or missing parts.
                                                 </li>
                                                 <li>
                                                        <strong>Gift:</strong> Once we’ve processed a gift return, we’ll issue a refund to the person who returned the gift.
                                                 </li>
                                          </ul>
                                   </section>

                                   <section>
                                          <h2>Possible charges following an advanced refund or replacement order</h2>
                                          <p>To avoid charges after receiving an advance refund or replacement order:</p>
                                          <ul>
                                                 <li>Return items by the date shown in your return confirmation email</li>
                                                 <li>Return items in their original condition only</li>
                                                 <li>Use the correct return label</li>
                                                 <li>Drop off your returns at approved locations</li>
                                          </ul>
                                          <p>If you don’t return the item in time:</p>
                                          <ol>
                                                 <li>We’ll send a reminder.</li>
                                                 <li>If we don’t receive the return, we’ll notify you and charge your account for the advance refund or replacement.</li>
                                                 <li>Once we receive and process your return, any charges will be reversed.</li>
                                          </ol>
                                   </section>

                                   <section>
                                          <h2>Refund processing times</h2>
                                          <p>Your bank might need extra time to process a refund. The timelines for different refund payment methods are:</p>
                                          <div className="table-wrapper">
                                                 <table className="policy-table">
                                                        <thead>
                                                               <tr>
                                                                      <th>Refund Method</th>
                                                                      <th>Refund Processing Time</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody>
                                                               <tr>
                                                                      <td>Credit card</td>
                                                                      <td>3-5 business days</td>
                                                               </tr>
                                                               <tr>
                                                                      <td>Shop with Reward Points</td>
                                                                      <td>Up to 5 business days</td>
                                                               </tr>
                                                               <tr>
                                                                      <td>Debit card</td>
                                                                      <td>Up to 10 business days</td>
                                                               </tr>
                                                               <tr>
                                                                      <td>Pre-paid credit card (depending on the issuer of the card)</td>
                                                                      <td>
                                                                             Your card is stored on your account for future use, even if you don’t have the physical pre-paid credit card.
                                                                      </td>
                                                               </tr>
                                                               <tr>
                                                                      <td>Promotional certificate</td>
                                                                      <td>Up to 30 days</td>
                                                               </tr>
                                                               <tr>
                                                                      <td>No refund issued</td>
                                                                      <td>If you returned your item more than 30 days ago and haven’t received any refund notifications, contact Xpertbid customer service.</td>
                                                               </tr>
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </section>

                                   <section>
                                          <h2>Partial refunds</h2>
                                          <p>
                                                 All returns are inspected against the expected item and refunds are reduced for signs of:
                                          </p>
                                          <ul>
                                                 <li>Customer use</li>
                                                 <li>Damage</li>
                                                 <li>Missing parts, accessories, or manuals</li>
                                          </ul>
                                          <p>For currency-converted orders, we refund in your local currency at the original exchange rate.</p>
                                   </section>

                                   <section>
                                          <h2>Tax on restocking fees</h2>
                                          <div className="table-wrapper">
                                                 <table className="policy-table">
                                                        <thead>
                                                               <tr>
                                                                      <th>Fee</th>
                                                                      <th>Description</th>
                                                                      <th>Amount</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody>
                                                               <tr>
                                                                      <td>Return Shipping Fee</td>
                                                                      <td>Issued if you select a return shipping method that isn’t free.</td>
                                                                      <td>Varies by item and the shipping method.</td>
                                                               </tr>
                                                               <tr>
                                                                      <td>Late Fee</td>
                                                                      <td>Issued if your item isn’t dropped off or picked up by a carrier on or before the return deadline.</td>
                                                                      <td>20% of the item price.</td>
                                                               </tr>
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </section>

                                   <footer className="policy-note">
                                          <p>This refund policy can be changed any time.</p>
                                   </footer>
                            </main>
                     </div>
              </AppLayout>
       );
}
