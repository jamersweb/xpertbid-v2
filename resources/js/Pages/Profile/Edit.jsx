import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ProfileSection from './Partials/ProfileSection';
import AddressSection from './Partials/AddressSection';
import SecuritySection from './Partials/SecuritySection';
import ReferralSection from './Partials/ReferralSection';
import NotificationSection from './Partials/NotificationSection';
import IdentityVerificationSection from './Partials/IdentityVerificationSection';
import Header from '@/Components/Header';

export default function Edit({ auth, mustVerifyEmail, status, address, identity, notificationSettings }) {
    const { url, props } = usePage();
    const { flash } = props;
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const initialTab = queryParams.get('tab') || 'profile';

    const [activeSection, setActiveSection] = useState(initialTab === 'identity_verification' ? 'identity' : initialTab);

    return (
        <AppLayout title="Account Settings">
            {/* Premium Toast Container */}

            <section className="account-setting bg-light" style={{ minHeight: '100vh', padding: '80px 0' }}>
                <div className="container">
                    <h2 className="mkt-sec mb-5 px-3" style={{ fontSize: '36px', fontWeight: '700', color: '#23262F' }}>Account Settings</h2>
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-md-4 mb-4">
                            <div className="setting bg-white shadow-sm p-4 p-md-5" style={{ borderRadius: '25px', boxShadow: '0 45px 90px 0 #00000021' }}>
                                <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: '700', color: '#23262F' }}>User Settings</h3>
                                <ul className="userSettingsMenu list-unstyled">
                                    {[
                                        { id: 'profile', label: 'My Profile' },
                                        { id: 'address', label: 'Address' },
                                        { id: 'referral', label: 'My Referral Code' },
                                        { id: 'notifications', label: 'Notification Settings' },
                                        { id: 'password', label: 'Password & Login' },
                                        { id: 'identity', label: 'Identity Verification' }
                                    ].map((item) => (
                                        <li key={item.id} className="mb-2">
                                            <button
                                                className={`btn w-100 text-start py-3 px-4 border-0 ${activeSection === item.id ? 'active-item' : ''}`}
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    borderRadius: '30px',
                                                    color: activeSection === item.id ? '#43ACE9' : '#353945',
                                                    backgroundColor: activeSection === item.id ? '#DCECFA' : 'transparent',
                                                    fontFamily: '"Inter", sans-serif',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onClick={() => setActiveSection(item.id)}
                                            >
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="col-md-8">
                            <div className="user-profile bg-white shadow-sm p-4 p-md-5" style={{ borderRadius: '25px', boxShadow: '0 45px 90px 0 #00000021' }}>
                                {activeSection === 'profile' && <ProfileSection mustVerifyEmail={mustVerifyEmail} status={status} />}
                                {activeSection === 'address' && <AddressSection key={address?.id || 'new-address'} />}
                                {activeSection === 'referral' && <ReferralSection />}
                                {activeSection === 'password' && <SecuritySection />}
                                {activeSection === 'notifications' && <NotificationSection />}
                                {activeSection === 'identity' && <IdentityVerificationSection />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .active-item {
                    color: #43ACE9 !important;
                    background-color: #DCECFA !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button {
                    transition: all 0.3s ease !important;
                    padding: 10px 16px !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button:hover:not(.active-item) {
                    background-color: #F8F8F8 !important;
                    color: #23262F !important;
                }
                .account-setting h3, .account-setting h4, .account-setting h2 {
                    font-family: "Inter", sans-serif;
                    color: #23262F;
                }
                .user-profile {
                    background: #fff;
                }
                .form-label {
                    color: #777E91;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                .form-control, .form-select {
                    border-radius: 12px !important;
                    padding: 12px 20px !important;
                    font-weight: 500;
                    color: #23262F;
                    border: 1px solid #E6E8EC !important;
                }
                
                /* Global Button Styles from xpertbid-frontend */
                .button-style-1 {
                    background-color: #43ACE9;
                    color: #fff;
                    border: 1px solid #43ACE9;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-2 {
                    background-color: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-3 {
                    background-color: transparent;
                    color: #23262F;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                
                /* Shine effect */
                .button-style-1, .button-style-2, .button-style-3 {
                    position: relative;
                    overflow: hidden;
                }
                .button-style-1::after, .button-style-2::after, .button-style-3::after {
                    content: "";
                    position: absolute;
                    top: -70%;
                    left: -140%;
                    width: 80%;
                    height: 240%;
                    background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0) 100%);
                    transform: rotate(20deg);
                    opacity: 0;
                }
                .button-style-1:hover::after, .button-style-2:hover::after, .button-style-3:hover::after {
                    animation: button-shine-sweep 0.9s ease forwards;
                }
                @keyframes button-shine-sweep {
                    0% { left: -140%; opacity: 0; }
                    20% { opacity: 0.7; }
                    100% { left: 160%; opacity: 0; }
                }
                .button-style-1:hover, .button-style-2:hover, .button-style-3:hover {
                    filter: brightness(1.1);
                }

            `}</style>
        </AppLayout>
    );
}
