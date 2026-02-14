import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SuccessPopup from '@/Components/SuccessPopup';
import ErrorPopup from '@/Components/ErrorPopup';
import axios from 'axios';

export default function Index({ notifications }) {
       const { url } = usePage();
       const [filter, setFilter] = useState("most-recent");
       const [localNotifications, setLocalNotifications] = useState(notifications.data);
       const [showSuccess, setShowSuccess] = useState(false);
       const [showError, setShowError] = useState(false);
       const [message, setMessage] = useState("");

       const handleFilterChange = (e) => {
              setFilter(e.target.value);
       };

       const deleteNotification = async (id) => {
              if (!confirm('Are you sure you want to delete this notification?')) return;

              try {
                     await axios.delete(route('notifications.delete', id));
                     setLocalNotifications(prev => prev.filter(n => n.id !== id));
                     setMessage("Notification deleted successfully!");
                     setShowSuccess(true);
              } catch (error) {
                     setMessage("Failed to delete notification.");
                     setShowError(true);
              }
       };

       const markAsRead = async (id) => {
              try {
                     await axios.post(route('notifications.read', id));
                     setLocalNotifications(prev => prev.map(n =>
                            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                     ));
              } catch (error) {
                     console.error("Error marking as read", error);
              }
       };

       const markAllAsRead = () => {
              router.post(route('notifications.read_all'), {}, {
                     onSuccess: () => {
                            setLocalNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
                     }
              });
       };

       const filteredNotifications = localNotifications.filter((notification) => {
              if (filter === "unread") return !notification.read_at;
              // "earlier" in original code was hardcoded to 2022, which is odd. 
              // Let's just keep "most-recent" and "unread" for now or use a relative time.
              return true;
       });

       return (
              <AppLayout title="Notifications">
                     <Head title="Notifications" />

                     <SuccessPopup
                            isOpen={showSuccess}
                            onClose={() => setShowSuccess(false)}
                            message={message}
                     />
                     <ErrorPopup
                            isOpen={showError}
                            onClose={() => setShowError(false)}
                            message={message}
                     />

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="row justify-content-center">
                                          <div className="col-lg-10 col-xl-8">
                                                 <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                                                        <h1 className="h2 fw-bold text-dark m-0">Notifications</h1>
                                                        <div className="d-flex align-items-center gap-2">
                                                               <button
                                                                      onClick={markAllAsRead}
                                                                      className="btn btn-link text-primary text-decoration-none fw-bold small"
                                                               >
                                                                      Mark all as read
                                                               </button>
                                                               <select
                                                                      className="form-select border-0 shadow-sm"
                                                                      style={{ width: '160px' }}
                                                                      value={filter}
                                                                      onChange={handleFilterChange}
                                                               >
                                                                      <option value="most-recent">Most Recent</option>
                                                                      <option value="unread">Unread</option>
                                                               </select>
                                                        </div>
                                                 </div>

                                                 {filteredNotifications.length === 0 ? (
                                                        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                                                               <div className="mb-3">
                                                                      <i className="fa-regular fa-bell-slash fa-3x text-muted opacity-25"></i>
                                                               </div>
                                                               <h2 className="h5 fw-bold text-dark">No notifications found</h2>
                                                               <p className="text-muted">You're all caught up!</p>
                                                        </div>
                                                 ) : (
                                                        <div className="notification-list d-flex flex-column gap-3">
                                                               {filteredNotifications.map((notification) => (
                                                                      <div
                                                                             key={notification.id}
                                                                             className={`notification-item p-3 border rounded-3 bg-white shadow-sm transition-all ${!notification.read_at ? 'border-primary border-start border-4' : ''}`}
                                                                             onClick={() => !notification.read_at && markAsRead(notification.id)}
                                                                             style={{ cursor: !notification.read_at ? 'pointer' : 'default' }}
                                                                      >
                                                                             <div className="d-flex align-items-start gap-3">
                                                                                    <div className="notification-icon bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                                                                           <img
                                                                                                  src={notification.image_url || "/assets/images/message-text.svg"}
                                                                                                  alt="Icon"
                                                                                                  style={{ width: '24px', height: '24px' }}
                                                                                           />
                                                                                    </div>
                                                                                    <div className="flex-grow-1">
                                                                                           <div className="d-flex justify-content-between align-items-start mb-1">
                                                                                                  <p className={`mb-0 ${!notification.read_at ? 'fw-bold text-dark' : 'text-secondary'}`}>
                                                                                                         {notification.title}
                                                                                                  </p>
                                                                                                  <button
                                                                                                         onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                                                                                         className="btn btn-link text-muted p-0 border-0"
                                                                                                  >
                                                                                                         <i className="fa-solid fa-xmark"></i>
                                                                                                  </button>
                                                                                           </div>
                                                                                           <div className="d-flex align-items-center gap-2 small text-muted font-monospace">
                                                                                                  <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                                                                                                  <span>•</span>
                                                                                                  <span>{new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 )}

                                                 {notifications.links && notifications.links.length > 3 && (
                                                        <div className="mt-4 d-flex justify-content-center">
                                                               {/* Traditional pagination links could go here if needed */}
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .notification-item {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .notification-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
                .border-primary {
                    border-color: #0d6efd !important;
                }
            `}} />
              </AppLayout>
       );
}
