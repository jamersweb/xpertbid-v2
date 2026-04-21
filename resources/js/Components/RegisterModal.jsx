import { useState, useEffect } from "react";
import { Link, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from "axios";
import useTranslate from '@/hooks/useTranslate';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
       const { t } = useTranslate();
       const [activeStep, setActiveStep] = useState("step1");
       const [errorMessage, setErrorMessage] = useState("");
       const [loading, setLoading] = useState(false);
       const [otpSent, setOtpSent] = useState(false);
       const [resendTimer, setResendTimer] = useState(60);
       const [isResendDisabled, setIsResendDisabled] = useState(false);

       // Reset state on open
       useEffect(() => {
              if (isOpen) {
                     setActiveStep("step1");
                     setErrorMessage("");
              }
       }, [isOpen]);

       const { data: formData, setData, post, processing, errors, reset } = useForm({
              name: "",
              email: "",
              phone: "",
              password: "",
              countryCode: "+92",
              terms: true,
              otp: "",
              signup_source: "web"
       });

       const handleStepChange = (step) => {
              setActiveStep(step);
       };

       const handleEmailRegister = (e) => {
              e.preventDefault();
              setErrorMessage("");
              post(route('register'), {
                     onSuccess: () => {
                            onClose();
                     },
                     onError: (err) => {
                            setErrorMessage(Object.values(err)[0] || t('auth.registration_failed'));
                     }
              });
       };

       const registerWithPhone = async () => {
              if (!formData.name || !formData.phone || !formData.password) {
                     setErrorMessage(t('auth.all_fields_required'));
                     return;
              }
              setLoading(true);
              setErrorMessage("");
              try {
                     const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/send-otp', {
                            phone: formattedPhone,
                            type: 'register',
                            signup_source: 'web'
                     });
                     setOtpSent(true);
                     setActiveStep("otpVerification");
                     startTimer();
              } catch (error) {
                     setErrorMessage(error.response?.data?.message || t('auth.failed_send_otp'));
              } finally {
                     setLoading(false);
              }
       };

       const handleVerifyPhoneOtp = async () => {
              setLoading(true);
              setErrorMessage("");
              try {
                     const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/verify-otp', {
                            phone: formattedPhone,
                            otp: formData.otp,
                            name: formData.name,
                            password: formData.password,
                            signup_source: 'web'
                     });
                     onClose();
                     router.visit(route('dashboard'));
              } catch (error) {
                     setErrorMessage(error.response?.data?.message || t('auth.invalid_otp'));
              } finally {
                     setLoading(false);
              }
       };

       const startTimer = () => {
              setIsResendDisabled(true);
              setResendTimer(60);
              const timer = setInterval(() => {
                     setResendTimer((prev) => {
                            if (prev <= 1) {
                                   clearInterval(timer);
                                   setIsResendDisabled(false);
                                   return 0;
                            }
                            return prev - 1;
                     });
              }, 1000);
       };

       const handleGoogleSignUp = () => {
              window.location.href = route('auth.google');
       };

       if (!isOpen) return null;

       return (
              <div id="SignupModal" className="signupModal video-modal" style={{ display: isOpen ? "block" : "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060, overflowY: 'auto' }}>
                     <div className="signupmodal-content" style={{ position: 'relative', margin: '50px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '600px' }}>
                            <span className="close-btn" style={{ position: 'absolute', right: '20px', top: '20px', cursor: 'pointer', zIndex: 10 }} onClick={onClose}>
                                   <i className="fa-solid fa-xmark" style={{ backgroundColor: '#EDEDED', color: '#23262F', padding: '6px 8px', fontSize: '12px', borderRadius: '100%' }}></i>
                            </span>

                            {activeStep === "step1" && (
                                   <div className="text-center">
                                          <h2 className="mb-4 fw-bold text-center">{t('Sign Up')}</h2>

                                          <button onClick={handleGoogleSignUp} className="signUpContinueIcon">
                                                 <img src="/assets/images/googleLogo.svg" alt="Google" width={20} className="me-2" />
                                                 {t('auth.continue_google')}
                                          </button>

                                          {/* Placeholder for Apple Signup - functionality to be implemented */}
                                          <button className="signUpContinueIcon">
                                                 <img src="/assets/images/appleLogo.svg" alt="Apple" width={20} className="me-2" />
                                                 {t('auth.continue_apple')}
                                          </button>

                                          <button onClick={() => handleStepChange("emailSignup")} className="signUpContinueIcon">
                                                 <img src="/assets/images/smsLogo.svg" alt="Email" width={20} className="me-2" />
                                                 {t('auth.signup_with_email')}
                                          </button>

                                          <button onClick={() => handleStepChange("phoneSignup")} className="signUpContinueIcon">
                                                 <img src="/assets/images/MobileLogo.svg" alt="Phone" width={20} className="me-2" />
                                                 {t('auth.signup_with_phone')}
                                          </button>

                                          <p className="small text-left text-muted my-4">
                                                 {t('auth.by_continuing_prefix')} xpertBid <Link href="/terms" className="text-decoration-underline text-primary" onClick={onClose}>{t('auth.terms_of_service')}</Link> {t('auth.and')} <Link href="/privacy-policy" className="text-decoration-underline text-primary" onClick={onClose}>{t('auth.privacy_policy')}</Link>
                                          </p>
                                   </div>
                            )}

                            {activeStep === "emailSignup" && (
                                   <div id="stepEmail">
                                          <div className="step-heading-and-back">
                                                 <button id="backEmail" onClick={() => handleStepChange("step1")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.signup_with_email')}</h3>
                                          </div>

                                          <form onSubmit={handleEmailRegister}>
                                                 <div className="mb-3">
                                                        <input
                                                               type="text"
                                                               placeholder={t('auth.enter_name')}
                                                               value={formData.name}
                                                               onChange={(e) => setData('name', e.target.value)}
                                                               required
                                                        />
                                                 </div>
                                                 <div className="mb-3">
                                                        <input
                                                               type="email"
                                                               placeholder={t('auth.enter_email')}
                                                               value={formData.email}
                                                               onChange={(e) => setData('email', e.target.value)}
                                                               required
                                                        />
                                                 </div>
                                                 <div className="mb-3">
                                                        <input
                                                               type="tel"
                                                               placeholder={t('auth.enter_phone_number')}
                                                               value={formData.phone}
                                                               onChange={(e) => setData('phone', e.target.value)}
                                                               required
                                                        />
                                                 </div>
                                                 <div className="mb-4">
                                                        <input
                                                               type="password"
                                                               placeholder={t('auth.create_password')}
                                                               value={formData.password}
                                                               onChange={(e) => setData('password', e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 {errorMessage && <div className="alert-message">{errorMessage}</div>}

                                                 <button className="form-button-1" disabled={processing}>
                                                        {processing ? t('auth.creating_account') : t('auth.continue')}
                                                 </button>
                                          </form>

                                          <div className="text-center mt-3">
                                                 <span className="small text-muted">{t('auth.already_have_account')} </span>
                                                 <button className="btn btn-link text-decoration-underline p-0 small text-dark fw-bold" onClick={onSwitchToLogin}>
                                                        {t('Login')}
                                                 </button>
                                          </div>
                                   </div>
                            )}

                            {activeStep === "phoneSignup" && (
                                   <div id="phoneSignup">
                                          <div className="step-heading-and-back">
                                                 <button className="backbuttonSignup" onClick={() => handleStepChange("step1")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.signup_with_phone')}</h3>
                                          </div>

                                          <div className="mb-3">
                                                 <div className="steps-input-select">
                                                        <input
                                                               type="text"
                                                               placeholder={t('auth.enter_name')}
                                                               value={formData.name}
                                                               onChange={(e) => setData('name', e.target.value)}
                                                               required
                                                        />
                                                 </div>
                                          </div>

                                          <div className="mb-3">
                                                 <div className="input-group steps-input-select d-flex">
                                                        <select
                                                               className="form-select w-auto flex-grow-0 bg-light border-end-0 rounded-start-3"
                                                               value={formData.countryCode}
                                                               onChange={(e) => setData('countryCode', e.target.value)}
                                                               style={{ maxWidth: '120px', marginBottom: '20px', borderRadius: '12px 0 0 12px' }}
                                                        >
                                                               <option value="+92">+92 PK</option>
                                                               <option value="+971">+971 UAE</option>
                                                        </select>
                                                        <input
                                                               type="tel"
                                                               className="form-control"
                                                               placeholder={t('auth.enter_phone_number')}
                                                               value={formData.phone}
                                                               onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ""))}
                                                               style={{ borderRadius: '0 12px 12px 0' }}
                                                        />
                                                 </div>
                                          </div>

                                          <div className="mb-4">
                                                 <div className="steps-input-select">
                                                        <input
                                                               type="password"
                                                               placeholder="Create password"
                                                               value={formData.password}
                                                               onChange={(e) => setData('password', e.target.value)}
                                                               required
                                                        />
                                                 </div>
                                          </div>

                                          {errorMessage && <div className="alert-message">{errorMessage}</div>}

                                          <button className="form-button-1" disabled={loading} onClick={registerWithPhone}>
                                                 {loading ? "Sending..." : "Send OTP"}
                                          </button>
                                   </div>
                            )}

                            {activeStep === "otpVerification" && (
                                   <div id="emailOtp-container">
                                          <div className="step-heading-and-back">
                                                 <button className="backbuttonSignup" onClick={() => handleStepChange("phoneSignup")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">Verify OTP</h3>
                                          </div>

                                          <p className="mb-4 small text-muted text-center">Enter the OTP sent to {formData.countryCode}{formData.phone}</p>

                                          <div className="mb-4 d-flex justify-content-center gap-2">
                                                 <input
                                                        type="text"
                                                        className="form-control text-center fs-4 tracking-widest fw-bold"
                                                        placeholder="····"
                                                        maxLength={4}
                                                        value={formData.otp || ""}
                                                        onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ""))}
                                                        style={{ width: '100%', height: '68px' }}
                                                 />
                                          </div>

                                          {errorMessage && <div className="alert-message">{errorMessage}</div>}

                                          <button className="form-button-1" disabled={loading || !formData.otp || formData.otp.length < 4} onClick={handleVerifyPhoneOtp}>
                                                 {loading ? "Verifying..." : "Verify & Sign Up"}
                                          </button>

                                          <div className="text-center mt-3">
                                                 <button
                                                        className="btn btn-link text-decoration-none p-0 small text-dark fw-bold"
                                                        disabled={isResendDisabled}
                                                        onClick={registerWithPhone}
                                                 >
                                                        {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"}
                                                 </button>
                                          </div>
                                   </div>
                            )}
                     </div>
              </div>
       );
};

export default RegisterModal;
