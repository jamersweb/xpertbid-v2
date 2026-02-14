import React, { createContext, useContext, useState } from 'react';
import LoginModal from '@/Components/LoginModal';
import RegisterModal from '@/Components/RegisterModal';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
       const [activeModal, setActiveModal] = useState(null); // 'login', 'register' or null

       const openLogin = () => setActiveModal('login');
       const openRegister = () => setActiveModal('register');
       const closeModals = () => setActiveModal(null);

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
