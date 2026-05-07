import { Head, Link, router, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import CurrencyPicker from '@/Components/CurrencyPicker';
import { CartProvider } from '@/Contexts/CartContext';
import { AuthModalProvider } from '@/Contexts/AuthModalContext';
import { useState, useEffect } from 'react';
import useTranslate from '@/hooks/useTranslate';

export default function AppLayout({ children, title }) {
       const { flash, auth, ziggy, locale } = usePage().props;
       const { t } = useTranslate();
       const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
       const [isHiding, setIsHiding] = useState(false);
       const currentLocale = locale?.current || 'en';
       const currentDirection = locale?.supported?.[currentLocale]?.direction || (currentLocale === 'ur' ? 'rtl' : 'ltr');
       const supportedLocales = Object.entries(locale?.supported || {});

       const individualVerificationStatus =
              auth?.user?.individual_verification?.status || auth?.user?.individualVerification?.status;
       const corporateVerificationStatus =
              auth?.user?.corporate_verification?.status || auth?.user?.corporateVerification?.status;
       const verificationStatus = corporateVerificationStatus || individualVerificationStatus || 'unverified';
       const currentPath = ziggy?.location && ziggy.location.startsWith('http') 
              ? new URL(ziggy.location).pathname 
              : (ziggy?.location || '');
       const shouldShowVerifyButton =
              Boolean(auth?.user) &&
              verificationStatus !== 'verified' &&
              (auth?.user ? currentPath !== route('verification.identity', {}, false) : false);

       const handleLocaleChange = (nextLocale) => {
              if (nextLocale === currentLocale) return;

              router.post(route('locale.update'), { locale: nextLocale }, { preserveScroll: true });
       };

       useEffect(() => {
              if (flash?.success || flash?.error || flash?.info) {
                     setToast({
                            show: true,
                            message: flash.success || flash.error || flash.info,
                            type: flash.success ? 'success' : flash.error ? 'error' : 'info'
                     });
                     setIsHiding(false);
                     const timer = setTimeout(() => {
                            setIsHiding(true);
                            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 500);
                     }, 5000);
                     return () => clearTimeout(timer);
              }
       }, [flash]);

       useEffect(() => {
              if (typeof document === 'undefined') return;

              document.documentElement.lang = currentLocale;
              document.documentElement.dir = currentDirection;
              document.body.classList.toggle('locale-ur', currentLocale === 'ur');
              document.body.classList.toggle('locale-rtl', currentDirection === 'rtl');
       }, [currentLocale, currentDirection]);

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
                                                               ) : toast.type === 'info' ? (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="10" x2="12" y2="17"></line><line x1="12" y1="7" x2="12.01" y2="7"></line></svg>
                                                               ) : (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                               )}
                                                        </div>
                                                        <div className="premium-toast-content">
                                                               <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff' }}>{toast.type === 'error' ? t('Error') : toast.type === 'info' ? t('Notice') : t('Success')}</div>
                                                               <div style={{ fontSize: '13px', opacity: 0.8, color: '#fff' }}>{toast.message}</div>
                                                        </div>
                                                 </div>
                                          </div>
                                   )}

                                   <section className="xp-brand-top-banner" aria-label="XpertBid brand banner">
                                          <div className="xp-brand-links">
                                                 <Link className="xp-brand-link" href="/marketplace/real-estate-property-auction?type=auction" aria-label="View property marketplace">
                                                        <img className="xp-brand-logo xp-brand-logo-prop" src="/assets/images/xp-prop-logo-clean.png" alt="XpertBid Property" />
                                                 </Link>
                                                 <Link className="xp-brand-link" href="/marketplace/vehicles?type=auction" aria-label="View vehicle marketplace">
                                                        <img className="xp-brand-logo xp-brand-logo-vehicle" src="/assets/images/xp-vehicle-logo-clean.png" alt="XpertBid Vehicle" />
                                                 </Link>
                                                 <Link className="xp-brand-link d-none" href="/marketplace" aria-label="View mandi marketplace">
                                                        <img className="xp-brand-logo xp-brand-logo-mandi" src="/assets/images/xp-mandi-logo-clean.svg" alt="XpertBid Mandi" />
                                                 </Link>
                                          </div>
                                          <div className="xp-brand-controls d-none d-lg-flex">
                                                 <select
                                                        className="xp-brand-language-select"
                                                        value={currentLocale}
                                                        onChange={(e) => handleLocaleChange(e.target.value)}
                                                        aria-label={t('Select Language')}
                                                 >
                                                        {supportedLocales.map(([code, details]) => (
                                                               <option key={code} value={code}>
                                                                      {details.native || details.name || code.toUpperCase()}
                                                               </option>
                                                        ))}
                                                 </select>
                                                 <CurrencyPicker />
                                          </div>
                                   </section>

                                   <Header />

                                   <main>
                                          {children}
                                   </main>

                                   {shouldShowVerifyButton && (
                                          <button
                                                 type="button"
                                                 className="global-verify-account-btn"
                                                 onClick={() => window.location.href = route('verification.identity')}
                                          >
                                                 <i className="fa-solid fa-user-check"></i>
                                                 <span>{t('Verify Account')}</span>
                                          </button>
                                   )}

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
                                   .xp-brand-top-banner {
                                          width: 100%;
                                          background: #ffffff;
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          gap: 16px;
                                          overflow: hidden;
                                          padding: 8px 48px;
                                   }
                                   .xp-brand-links {
                                          display: inline-flex;
                                          align-items: center;
                                          gap: 10px;
                                          min-width: 0;
                                   }
                                   .xp-brand-controls {
                                          align-items: center;
                                          gap: 10px;
                                          flex: 0 0 auto;
                                   }
                                   .xp-brand-language-select {
                                          height: 38px;
                                          border: 1px solid #D8E0EA;
                                          border-radius: 10px;
                                          padding: 0 12px;
                                          background: #F8FBFF;
                                          color: #23262F;
                                          font-size: 14px;
                                          font-weight: 600;
                                          outline: none;
                                   }
                                   .xp-brand-logo {
                                          height: auto;
                                          object-fit: contain;
                                          display: block;
                                          flex: 0 1 auto;
                                   }
                                   .xp-brand-link {
                                          display: inline-flex;
                                          align-items: center;
                                          line-height: 0;
                                          text-decoration: none;
                                          transition: opacity 0.2s ease;
                                   }
                                   .xp-brand-link:hover {
                                          opacity: 0.82;
                                   }
                                   .xp-brand-logo-prop {
                                          width: 180px;
                                          max-height: 54px;
                                   }
                                   .xp-brand-logo-vehicle {
                                          width: 180px;
                                          max-height: 46px;
                                   }
                                   .xp-brand-logo-mandi {
                                          width: 180px;
                                          max-height: 46px;
                                   }
                                   @keyframes slideInRight {
                                          from { transform: translateX(120%); opacity: 0; }
                                          to { transform: translateX(0); opacity: 1; }
                                   }
                                   @keyframes slideOutRight {
                                          from { transform: translateX(0); opacity: 1; }
                                          to { transform: translateX(120%); opacity: 0; }
                                   }
                                   .global-verify-account-btn {
                                          position: fixed;
                                          left: 18px;
                                          bottom: 24px;
                                          z-index: 999;
                                          display: inline-flex;
                                          align-items: center;
                                          gap: 10px;
                                          border: none;
                                          border-radius: 12px;
                                          background: #ffffff;
                                          color: #23262F;
                                          padding: 12px 18px;
                                          font-size: 14px;
                                          font-weight: 700;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.14);
                                          transition: transform 0.2s ease, box-shadow 0.2s ease;
                                   }
                                   .global-verify-account-btn i {
                                          color: #ff5a67;
                                          font-size: 16px;
                                   }
                                   .global-verify-account-btn:hover {
                                          transform: translateY(-1px);
                                          box-shadow: 0 14px 32px rgba(0,0,0,0.18);
                                   }
                                   @media (max-width: 768px) {
                                          .xp-brand-top-banner {
                                                 justify-content: center;
                                                 gap: 8px;
                                                 padding: 8px 10px;
                                          }
                                          .xp-brand-links {
                                                 justify-content: center;
                                                 gap: 6px;
                                                 width: 100%;
                                          }
                                          .xp-brand-logo-prop {
                                                 width: min(32vw, 170px);
                                                 max-height: 42px;
                                          }
                                          .xp-brand-logo-vehicle {
                                                 width: min(32vw, 170px);
                                                 max-height: 36px;
                                          }
                                          .xp-brand-logo-mandi {
                                                 width: min(32vw, 170px);
                                                 max-height: 36px;
                                          }
                                          .global-verify-account-btn {
                                                 left: 12px;
                                                 bottom: 86px;
                                                 padding: 10px 14px;
                                                 font-size: 13px;
                                          }
                                   }
                            `}</style>
                     </AuthModalProvider>
              </CartProvider>
       );
}
