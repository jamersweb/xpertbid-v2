import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { CartProvider } from '@/Contexts/CartContext';
import { AuthModalProvider } from '@/Contexts/AuthModalContext';
import { useState, useEffect } from 'react';

export default function AppLayout({ children, title }) {
       const { flash } = usePage().props;
       const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
       const [isHiding, setIsHiding] = useState(false);

       useEffect(() => {
              if (flash?.success || flash?.error) {
                     setToast({
                            show: true,
                            message: flash.success || flash.error,
                            type: flash.success ? 'success' : 'error'
                     });
                     setIsHiding(false);
                     const timer = setTimeout(() => {
                            setIsHiding(true);
                            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 500);
                     }, 5000);
                     return () => clearTimeout(timer);
              }
       }, [flash]);

       return (
              <CartProvider>
                     <AuthModalProvider>
                            <div className="min-h-screen bg-gray-100">
                                   {title && <Head title={title} />}

                                   {/* Premium Toast Container */}
                                   {toast.show && (
                                          <div className="toast-container">
                                                 <div className={`premium-toast ${isHiding ? 'hiding' : ''}`} style={{ borderLeftColor: toast.type === 'error' ? '#FF4D4D' : '#43ACE9' }}>
                                                        <div className="premium-toast-icon" style={{ backgroundColor: toast.type === 'error' ? '#FF4D4D' : '#43ACE9' }}>
                                                               {toast.type === 'error' ? (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                               ) : (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                               )}
                                                        </div>
                                                        <div className="premium-toast-content">
                                                               <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff' }}>{toast.type === 'error' ? 'Error' : 'Success'}</div>
                                                               <div style={{ fontSize: '13px', opacity: 0.8, color: '#fff' }}>{toast.message}</div>
                                                        </div>
                                                 </div>
                                          </div>
                                   )}

                                   <Header />

                                   <main>
                                          {children}
                                   </main>

                                   <Footer />
                                   <MobileBottomNav />
                            </div>

                            <style>{`
                                   /* Premium Toast Notification */
                                   .toast-container {
                                          position: fixed;
                                          top: 20px;
                                          right: 20px;
                                          z-index: 9999;
                                          display: flex;
                                          flex-direction: column;
                                          gap: 10px;
                                   }
                                   .premium-toast {
                                          background: #23262F;
                                          color: #fff;
                                          padding: 16px 24px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                                          display: flex;
                                          align-items: center;
                                          gap: 12px;
                                          min-width: 300px;
                                          animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                                          border-left: 4px solid #43ACE9;
                                   }
                                   .premium-toast.hiding {
                                          animation: slideOutRight 0.5s ease forwards;
                                   }
                                   .premium-toast-icon {
                                          background: #43ACE9;
                                          width: 24px;
                                          height: 24px;
                                          border-radius: 50%;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          flex-shrink: 0;
                                   }
                                   @keyframes slideInRight {
                                          from { transform: translateX(120%); opacity: 0; }
                                          to { transform: translateX(0); opacity: 1; }
                                   }
                                   @keyframes slideOutRight {
                                          from { transform: translateX(0); opacity: 1; }
                                          to { transform: translateX(120%); opacity: 0; }
                                   }
                            `}</style>
                     </AuthModalProvider>
              </CartProvider>
       );
}
