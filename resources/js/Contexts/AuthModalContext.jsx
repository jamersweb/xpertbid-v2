import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import LoginModal from '@/Components/LoginModal';
import RegisterModal from '@/Components/RegisterModal';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
       const { url } = usePage();
       const [activeModal, setActiveModal] = useState(null); // 'login', 'register' or null

       const openLogin = () => setActiveModal('login');
       const openRegister = () => setActiveModal('register');
       const closeModals = () => {
              setActiveModal(null);

              if (typeof window === 'undefined') return;

              const currentUrl = new URL(window.location.href);
              if (currentUrl.searchParams.has('auth')) {
                     currentUrl.searchParams.delete('auth');
                     window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
              }
       };

       useEffect(() => {
              if (typeof window === 'undefined') return;

              const currentUrl = new URL(window.location.href);
              const authMode = currentUrl.searchParams.get('auth');

              if (authMode === 'login') {
                     setActiveModal('login');
              } else if (authMode === 'register') {
                     setActiveModal('register');
              }
       }, [url]);

       return (
              <AuthModalContext.Provider value={{ openLogin, openRegister, closeModals, activeModal }}>
                     {children}
                     <LoginModal
                            isOpen={activeModal === 'login'}
                            onClose={closeModals}
                            onSwitchToRegister={openRegister}
                     />
                     <RegisterModal
                            isOpen={activeModal === 'register'}
                            onClose={closeModals}
                            onSwitchToLogin={openLogin}
                     />
              </AuthModalContext.Provider>
       );
};

export const useAuthModal = () => {
       const context = useContext(AuthModalContext);
       if (!context) {
              throw new Error('useAuthModal must be used within an AuthModalProvider');
       }
       return context;
};
