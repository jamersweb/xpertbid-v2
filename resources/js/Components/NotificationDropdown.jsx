import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, usePage } from "@inertiajs/react";

const NotificationDropdown = () => {
       const { auth } = usePage().props;
       const [isOpen, setIsOpen] = useState(false);
       const [notifications, setNotifications] = useState([]);
       const [loading, setLoading] = useState(true);
       const notificationRef = useRef(null);

       useEffect(() => {
              if (auth.user) {
                     fetchNotifications();
              }
       }, [auth.user]);

       useEffect(() => {
              const handleClickOutside = (event) => {
                     if (
                            notificationRef.current &&
                            !notificationRef.current.contains(event.target) &&
                            !event.target.closest(".notification")
                     ) {
                            setIsOpen(false);
                     }
              };
              document.addEventListener("mousedown", handleClickOutside);
              return () => {
                     document.removeEventListener("mousedown", handleClickOutside);
              };
       }, []);

       const fetchNotifications = async () => {
              try {
                     const response = await axios.get('/api/notifications');
                     setNotifications(response.data);
              } catch (error) {
                     console.error("Error fetching notifications:", error);
              } finally {
                     setLoading(false);
              }
       };

       const markAsRead = async (id) => {
              try {
                     await axios.post(`/api/notifications/read/${id}`);
                     setNotifications((prev) =>
                            prev.map((n) =>
                                   n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                            )
                     );
              } catch (error) {
                     console.error("Error marking notification as read:", error);
              }
       };

       const markAllAsRead = async () => {
              try {
                     await axios.post('/api/notifications/read-all');
                     setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
                     );
              } catch (error) {
                     console.error("Error marking notifications as read:", error);
              }
       };

       const deleteNotification = async (id) => {
              if (window.confirm("Are you sure you want to delete this notification?")) {
                     try {
                            await axios.delete(`/api/notifications/${id}`);
                            setNotifications((prev) => prev.filter((n) => n.id !== id));
                     } catch (error) {
                            console.error("Error deleting notification:", error);
                     }
              }
       };

       const unreadCount = notifications.filter((n) => !n.read_at).length;

       return (
              <div className="notification-container">
                     <button
                            className="notification nav-notification rounded"
                            style={{
                                   border: "none",
                                   backgroundColor: "transparent",
                                   position: 'relative',
                                   padding: '8px'
                            }}
                            onClick={() => setIsOpen(!isOpen)}
                     >
                            <img src="/assets/images/notificationIcon.svg" alt="Notifications" />
                            {unreadCount > 0 && (
                                   <span
                                          style={{
                                                 position: 'absolute',
                                                 top: '0px',
                                                 right: '0px',
                                                 backgroundColor: '#dc3545',
                                                 color: 'white',
                                                 borderRadius: '50%',
                                                 width: '18px',
                                                 height: '18px',
                                                 fontSize: '10px',
                                                 display: 'flex',
                                                 alignItems: 'center',
                                                 justifyContent: 'center',
                                                 fontWeight: 'bold'
                                          }}
                                   >
                                          {unreadCount > 99 ? '99+' : unreadCount}
                                   </span>
                            )}
                     </button>

                     {isOpen && (
                            <div className="notification-popup" ref={notificationRef} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1000, background: 'white', border: '1px solid #ddd', minWidth: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                                   <div className="notification-content p-3 border-bottom d-flex justify-content-between align-items-center">
                                          <h3 className="m-0" style={{ fontSize: '1rem' }}>{notifications.length > 0 ? "Notifications" : "No new notifications"}</h3>
                                          {notifications.length > 0 && (
                                                 <button className="markAsRead btn btn-link p-0 text-decoration-none" style={{ fontSize: '0.8rem' }} onClick={markAllAsRead}>
                                                        <img src="/assets/images/double-tick.svg" alt="Mark All" className="me-1" /> Mark all read
                                                 </button>
                                          )}
                                   </div>

                                   <div className="notification-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                          {loading && <p className="p-3 text-center">Loading notifications...</p>}
                                          {!loading && notifications.length === 0 && <p className="p-3 text-center">Empty</p>}
                                          {!loading &&
                                                 notifications.map((notification) => (
                                                        <div key={notification.id} className={`notification-item p-2 border-bottom ${notification.read_at ? "opacity-50" : ""}`} style={{ fontSize: '0.85rem' }}>
                                                               <div className="d-flex gap-2">
                                                                      <img src={notification.image_url || "/assets/images/message-text.svg"} alt="" width={32} height={32} />
                                                                      <div className="flex-grow-1">
                                                                             <p className="mb-0 fw-bold">{notification.title}</p>
                                                                             <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                                                                    {new Date(notification.created_at).toLocaleString()}
                                                                             </p>
                                                                      </div>
                                                                      <div className="d-flex flex-column gap-1">
                                                                             {!notification.read_at && (
                                                                                    <button className="btn btn-sm btn-link p-0" onClick={() => markAsRead(notification.id)}>
                                                                                           <i className="fa-solid fa-check text-success"></i>
                                                                                    </button>
                                                                             )}
                                                                             <button className="btn btn-sm btn-link p-0" onClick={() => deleteNotification(notification.id)}>
                                                                                    <i className="fa-solid fa-xmark text-danger"></i>
                                                                             </button>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 ))}
                                   </div>

                                   <div className="notification-footer p-2 text-center border-top">
                                          <Link href="/notifications-page" style={{ fontSize: '0.8rem' }}>See All Notifications</Link>
                                   </div>
                            </div>
                     )}
              </div>
       );
};

export default NotificationDropdown;
