import { useState, useEffect } from "react";
import { Link, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from "axios";
import useTranslate from '@/hooks/useTranslate';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
       const { t } = useTranslate();
       const [currentStep, setCurrentStep] = useState("loginStep");
       const [errorMessage, setErrorMessage] = useState("");
       const [otpSent, setOtpSent] = useState(false);
       const [resendTimer, setResendTimer] = useState(60);
       const [isResendDisabled, setIsResendDisabled] = useState(true);
       const [showPassword, setShowPassword] = useState(false);

       // Reset state when modal opens
       useEffect(() => {
              if (isOpen) {
                     setCurrentStep("loginStep");
                     setErrorMessage("");
                     setShowPassword(false);
              }
       }, [isOpen]);

       const { data: emailData, setData: setEmailData, post: postEmail, processing: emailProcessing, errors: emailErrors } = useForm({
              email: "",
              password: "",
              remember: false,
       });

       const [phoneData, setPhoneData] = useState({
              phone: "",
              otp: "",
              countryCode: "+92",
              otp_type: 'sms'
       });

       // Forgot Password State (Email)
       const [forgotEmail, setForgotEmail] = useState("");
       const [forgotMessage, setForgotMessage] = useState("");
       const [forgotErrors, setForgotErrors] = useState({});
       const [forgotProcessing, setForgotProcessing] = useState(false);

       // Forgot Password State (Phone / WhatsApp)
       const [forgotPhoneData, setForgotPhoneData] = useState({
              phone: "",
              countryCode: "+92",
              otp: "",
              password: "",
              password_confirmation: "",
       });
       const [forgotPhoneErrors, setForgotPhoneErrors] = useState({});
       const [forgotPhoneProcessing, setForgotPhoneProcessing] = useState(false);
       const [forgotPhoneResendTimer, setForgotPhoneResendTimer] = useState(60);
       const [isForgotPhoneResendDisabled, setIsForgotPhoneResendDisabled] = useState(true);
       const [showForgotPhonePassword, setShowForgotPhonePassword] = useState(false);
       const [showForgotPhoneConfirmPassword, setShowForgotPhoneConfirmPassword] = useState(false);

       const startForgotPhoneTimer = () => {
              setIsForgotPhoneResendDisabled(true);
              setForgotPhoneResendTimer(60);
              const timer = setInterval(() => {
                     setForgotPhoneResendTimer((prev) => {
                            if (prev <= 1) {
                                   clearInterval(timer);
                                   setIsForgotPhoneResendDisabled(false);
                                   return 0;
                            }
                            return prev - 1;
                     });
              }, 1000);
       };

       const handleSendForgotPhoneOtp = async () => {
              if (!validatePhoneNumber(forgotPhoneData.phone)) {
                     setForgotPhoneErrors({ phone: t('auth.invalid_phone') || "Please enter a valid phone number." });
                     return;
              }
              setForgotPhoneErrors({});
              setForgotPhoneProcessing(true);
              try {
                     const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/send-otp', {
                            phone: formattedPhone,
                            type: 'forgot_password',
                            otp_type: 'whatsapp'
                     });
                     setCurrentStep("forgotPasswordPhoneOtp");
                     startForgotPhoneTimer();
              } catch (error) {
                     const msg = error.response?.data?.message || (error.response?.data?.errors?.phone ? error.response.data.errors.phone[0] : (t('auth.account_not_found_phone') || "Failed to send OTP."));
                     setForgotPhoneErrors({ phone: msg });
              } finally {
                     setForgotPhoneProcessing(false);
              }
       };

       const handleVerifyForgotPhoneOtp = async (e) => {
              if (e) e.preventDefault();
              if (!forgotPhoneData.otp || forgotPhoneData.otp.length < 6) {
                     setForgotPhoneErrors({ otp: t('auth.invalid_otp') || "Please enter complete 6-digit OTP." });
                     return;
              }
              setForgotPhoneErrors({});
              setForgotPhoneProcessing(true);
              try {
                     const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/validate-reset-otp', {
                            phone: formattedPhone,
                            otp: forgotPhoneData.otp,
                     });
                     setCurrentStep("forgotPasswordPhoneNewPassword");
              } catch (error) {
                     const msg = error.response?.data?.message || (t('auth.invalid_otp') || "Invalid or expired OTP.");
                     setForgotPhoneErrors({ otp: msg });
              } finally {
                     setForgotPhoneProcessing(false);
              }
       };

       const handleResetPhonePassword = async (e) => {
              if (e) e.preventDefault();
              if (!forgotPhoneData.otp || forgotPhoneData.otp.length < 6) {
                     setForgotPhoneErrors({ otp: t('auth.invalid_otp') || "Please enter complete 6-digit OTP." });
                     return;
              }
              if (!forgotPhoneData.password || forgotPhoneData.password.length < 6) {
                     setForgotPhoneErrors({ password: "Password must be at least 6 characters." });
                     return;
              }
              if (forgotPhoneData.password !== forgotPhoneData.password_confirmation) {
                     setForgotPhoneErrors({ password_confirmation: t('auth.passwords_do_not_match') || "Passwords do not match." });
                     return;
              }
              setForgotPhoneErrors({});
              setForgotPhoneProcessing(true);
              try {
                     const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/reset-password-phone', {
                            phone: formattedPhone,
                            otp: forgotPhoneData.otp,
                            password: forgotPhoneData.password,
                            password_confirmation: forgotPhoneData.password_confirmation
                     });
                     setCurrentStep("forgotPasswordPhoneSuccess");
              } catch (error) {
                     const data = error.response?.data;
                     if (data?.errors) {
                            setForgotPhoneErrors(data.errors);
                     } else {
                            setForgotPhoneErrors({ general: data?.message || (t('auth.invalid_otp') || "Failed to reset password.") });
                     }
              } finally {
                     setForgotPhoneProcessing(false);
              }
       };

       const handleForgotPassword = async (e) => {
              e.preventDefault();
              setForgotErrors({});
              setForgotProcessing(true);
              try {
                     await axios.post("/api/forgot-password", { email: forgotEmail });
                     setForgotMessage("sent");
              } catch (error) {
                     setForgotErrors(error.response?.data?.error || { email: t('auth.failed_send_link') });
              } finally {
                     setForgotProcessing(false);
              }
       };

       const handleEmailLogin = (e) => {
              e.preventDefault();
              setErrorMessage("");
              postEmail(route('login'), {
                     onSuccess: () => {
                            onClose();
                     },
                     onError: (err) => {
                            setErrorMessage(err.email || t('auth.invalid_credentials'));
                     }
              });
       };

       const handleContinueWithPhone = (type) => {
              setPhoneData(prev => ({ ...prev, otp_type: type }));
              setCurrentStep("phoneLogin");
       };

       const validatePhoneNumber = (num) => {
              return num.replace(/\D/g, "").length >= 7;
       };

       const handlePhoneLogin = (e) => {
              e.preventDefault();
              if (!validatePhoneNumber(phoneData.phone)) {
                     setErrorMessage(t('auth.invalid_phone'));
                     return;
              }
              if (!phoneData.password) {
                     setErrorMessage(t('auth.enter_password'));
                     return;
              }
              setErrorMessage("");

              const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;

              router.post(route('login'), {
                     email: formattedPhone,
                     password: phoneData.password,
                     remember: true // Assuming always remember for phone login, or add checkbox?
              }, {
                     onSuccess: () => {
                            onClose();
                     },
                     onError: (err) => {
                            // If login fails, maybe user is unverified? 
                            // Current backend LoginRequest throws 'auth.failed' generic error.
                            // Ideally we checks if verified.
                            // For now, just show error.
                            setErrorMessage(err.email || t('auth.invalid_credentials_forgot'));
                     }
              });
       };

       const sendOtp = async () => {
              if (!validatePhoneNumber(phoneData.phone)) {
                     setErrorMessage(t('auth.invalid_phone'));
                     return;
              }
              setErrorMessage("");
              try {
                     const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/send-otp', {
                            phone: formattedPhone,
                            type: 'login',
                            otp_type: phoneData.otp_type
                     });
                     setOtpSent(true);
                     setCurrentStep("otpStep");
                     startTimer();
              } catch (error) {
                     setErrorMessage(error.response?.data?.message || t('auth.failed_send_otp'));
              }
       };

       const verifyOtp = async () => {
              setErrorMessage("");
              try {
                     const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;
                     await axios.post('/api/auth/verify-otp', {
                            phone: formattedPhone,
                            otp: phoneData.otp
                     });
                     onClose();
                     router.visit(route('dashboard'));
              } catch (error) {
                     setErrorMessage(error.response?.data?.message || t('auth.invalid_otp'));
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

       const handleGoogleLogin = () => {
              window.location.href = route('auth.google');
       };

       if (!isOpen) return null;

       return (
              <div className="loginModal" style={{ display: isOpen ? "block" : "none" }}>
                     <div className="loginModal-content">
                            <span className="close-btn" id="closeLoginModal" onClick={onClose}>
                                   <i className="fa-solid fa-xmark"></i>
                            </span>

                            {currentStep === "loginStep" && (
                                   <div id="loginStep" className="login-form-step active text-center">
                                          <h3 className="mb-4 fw-bold">{t('auth.login_or_signup')}</h3>

                                          <button onClick={() => handleContinueWithPhone('sms')} className="loginContinueIcon">
                                                 <img src="/assets/images/MobileLogo.svg" alt="Phone" width={20} className="me-2" />
                                                 {t('auth.continue_phone')}
                                          </button>

                                          <button onClick={handleGoogleLogin} className="loginContinueIcon">
                                                 <img src="/assets/images/googleLogo.svg" alt="Google" width={20} className="me-2" />
                                                 {t('auth.continue_google')}
                                          </button>

                                          <button onClick={() => setCurrentStep("loginEmail")} className="loginContinueIcon">
                                                 <img src="/assets/images/smsLogo.svg" alt="Email" width={20} className="me-2" />
                                                 {t('auth.continue_email')}
                                          </button>

                                          {/* Placeholder for Apple Login - functionality to be implemented */}
                                          <button className="loginContinueIcon">
                                                 <img src="/assets/images/appleLogo.svg" alt="Apple" width={20} className="me-2" />
                                                 {t('auth.continue_apple')}
                                          </button>

                                          <p className="small text-left text-muted mb-0 mt-3">
                                                 {t('auth.by_continuing_prefix')} xpertBid <Link href="/terms" className="text-decoration-underline text-primary" onClick={onClose}>{t('auth.terms_of_service')}</Link> {t('auth.and')} <Link href="/privacy-policy" className="text-decoration-underline text-primary" onClick={onClose}>{t('auth.privacy_policy')}</Link>
                                          </p>

                                          {/* <div className="text-center mt-3">
                                                 <span className="small text-muted">Don't have an account? </span>
                                                 <button className="btn btn-link text-decoration-underline p-0 small text-dark fw-bold" onClick={onSwitchToRegister}>
                                                        Sign Up
                                                 </button>
                                          </div> */}
                                   </div>
                            )}

                            {currentStep === "phoneLogin" && (
                                   <div id="loginStep2" className="login-form-step">
                                          <div className="step-heading-and-back">
                                                 <button id="backPhoneLogin" onClick={() => setCurrentStep("loginStep")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_with_phone')}</h3>
                                          </div>

                                          <div className="mb-3">
                                                 <select
                                                        className="form-select border-0 bg-light rounded-3"
                                                        value={phoneData.countryCode}
                                                        onChange={(e) => setPhoneData({ ...phoneData, countryCode: e.target.value })}
                                                        style={{ width: '100%', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 >
                                                        <option value="+92">+92 PK</option>
                                                        <option value="+971">+971 UAE</option>
                                                 </select>
                                                 <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder={t('auth.enter_phone_number')}
                                                        value={phoneData.phone}
                                                        onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value.replace(/\D/g, "") })}
                                                        style={{ width: '100%', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 />
                                          </div>

                                          <div className="mb-3 position-relative">
                                                 <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t('auth.enter_password_placeholder')}
                                                        value={phoneData.password || ""}
                                                        onChange={(e) => setPhoneData({ ...phoneData, password: e.target.value })}
                                                        className="form-control"
                                                        style={{ paddingRight: '40px', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 />
                                                 <button
                                                        type="button"
                                                        className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{ right: '10px', top: '34px' }}
                                                 >
                                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                 </button>
                                          </div>

                                          <div className="d-flex justify-content-end mb-3">
                                                 <button
                                                        type="button"
                                                        className="btn btn-link small text-dark fw-bold text-decoration-none p-0"
                                                        onClick={() => {
                                                               setForgotPhoneData(prev => ({
                                                                      ...prev,
                                                                      phone: phoneData.phone,
                                                                      countryCode: phoneData.countryCode,
                                                                      otp: "",
                                                                      password: "",
                                                                      password_confirmation: ""
                                                               }));
                                                               setForgotPhoneErrors({});
                                                               setCurrentStep("forgotPasswordPhone");
                                                        }}
                                                 >
                                                        {t('auth.forgot_password')}
                                                 </button>
                                          </div>

                                          {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}

                                          <p className="mt-2 mb-4 text-muted small">{t('auth.login_phone_hint')}</p>

                                          <button className="form-button-1" onClick={handlePhoneLogin}>
                                                 {t('Login')}
                                          </button>
                                   </div>
                            )}

                            {/* OTP Step is likely no longer needed for Login if using Password, preserving/commenting just in case or for Signup/Forgot Password scenarios if shared */}
                            {currentStep === "otpStep" && (
                                   <div id="otpStep" className="login-form-step">
                                          <div className="step-heading-and-back">
                                                 <button id="backOtpLogin" onClick={() => setCurrentStep("phoneLogin")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.verify_otp')}</h3>
                                          </div>

                                          <p className="mb-4 small text-muted text-center">{t('auth.enter_sent_otp')} {phoneData.countryCode}{phoneData.phone}</p>

                                          <div className="mb-4 d-flex justify-content-center gap-2">
                                                 {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <input
                                                               key={index}
                                                               id={`otp-input-${index}`}
                                                               type="text"
                                                               maxLength={1}
                                                               className="form-control text-center fw-bold fs-4"
                                                               value={phoneData.otp[index] || ""}
                                                               onChange={(e) => {
                                                                      const val = e.target.value.replace(/\D/g, "");
                                                                      if (!val) return;

                                                                      const newOtp = phoneData.otp.split("");
                                                                      newOtp[index] = val;
                                                                      const newOtpString = newOtp.join("");
                                                                      setPhoneData({ ...phoneData, otp: newOtpString });

                                                                      if (index < 5) {
                                                                             document.getElementById(`otp-input-${index + 1}`).focus();
                                                                      }
                                                               }}
                                                               onKeyDown={(e) => {
                                                                      if (e.key === "Backspace") {
                                                                             if (!phoneData.otp[index] && index > 0) {
                                                                                    document.getElementById(`otp-input-${index - 1}`).focus();
                                                                             } else {
                                                                                    const newOtp = phoneData.otp.split("");
                                                                                    newOtp[index] = "";
                                                                                    setPhoneData({ ...phoneData, otp: newOtp.join("") });
                                                                             }
                                                                      }
                                                               }}
                                                               onPaste={(e) => {
                                                                      e.preventDefault();
                                                                      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                                                                      setPhoneData({ ...phoneData, otp: pastedData });
                                                               }}
                                                               style={{ width: '50px', height: '60px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                        />
                                                 ))}
                                          </div>

                                          {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}

                                          <button className="form-button-1" disabled={phoneData.otp.length < 6} onClick={verifyOtp}>
                                                 {t('auth.verify_and_login')}
                                          </button>

                                          <div className="text-center mt-3">
                                                 <button
                                                        className="btn btn-link text-decoration-none p-0 small text-dark fw-bold"
                                                        disabled={isResendDisabled}
                                                        onClick={sendOtp}
                                                >
                                                        {isResendDisabled ? `${t('auth.resend_in')} ${resendTimer}s` : t('auth.resend_code')}
                                                 </button>
                                          </div>
                                   </div>
                            )}

                            {currentStep === "loginEmail" && (
                                   <div id="loginEmail" className="login-form-step">
                                          <div className="step-heading-and-back">
                                                 <button id="backValidationLogin" onClick={() => setCurrentStep("loginStep")}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_with_email')}</h3>
                                          </div>

                                          <form onSubmit={handleEmailLogin}>
                                                 <div className="mb-3">
                                                        <input
                                                               type="email"
                                                               placeholder={t('auth.enter_email')}
                                                               value={emailData.email}
                                                               onChange={(e) => setEmailData('email', e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 <div className="mb-3 position-relative">
                                                        <input
                                                               type={showPassword ? "text" : "password"}
                                                               placeholder={t('auth.enter_password_placeholder')}
                                                               value={emailData.password}
                                                               onChange={(e) => setEmailData('password', e.target.value)}
                                                               required
                                                               style={{ paddingRight: '40px' }}
                                                        />
                                                        <button
                                                               type="button"
                                                               className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                                                               onClick={() => setShowPassword(!showPassword)}
                                                               style={{ right: '10px', top: '34px' }}
                                                        >
                                                               <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </button>
                                                 </div>

                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                               <label className="login-remember mb-0 d-inline-flex align-items-center gap-2" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                                                                      <input
                                                                             type="checkbox"
                                                                             id="rememberMe"
                                                                             checked={emailData.remember}
                                                                             onChange={(e) => setEmailData('remember', e.target.checked)}
                                                                             style={{ width: 16, height: 16, margin: 0, flexShrink: 0 }}
                                                                      />
                                                                      <span className="small text-muted">{t('auth.remember_me')}</span>
                                                               </label>
                                                               <button
                                                                      type="button"
                                                                      className="btn btn-link small text-dark fw-bold text-decoration-none p-0"
                                                                      onClick={() => setCurrentStep("forgotPassword")}
                                                               >
                                                                      {t('auth.forgot_password')}
                                                               </button>
                                                        </div>

                                                 {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}

                                                 <button className="form-button-1" disabled={emailProcessing}>
                                                        {emailProcessing ? t('auth.logging_in') : t('auth.continue')}
                                                 </button>
                                          </form>
                                   </div>
                            )}

                            {currentStep === "forgotPassword" && (
                                   <div id="forgotPasswordStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
                                          <div className="step-heading-and-back">
                                                 <button
                                                        id="backForgotPassword"
                                                        onClick={() => {
                                                               setForgotMessage("");
                                                               setCurrentStep("loginEmail");
                                                        }}
                                                        style={{
                                                               position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
                                                        }}
                                                 >
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 {/* The frontend has "Login or Sign up" here, but "Forgot Password" might be clearer? Sticking to reference: "Login or Sign up" */}
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_or_signup')}</h3>
                                          </div>

                                          {forgotMessage === "sent" ? (
                                                 <div className="text-center py-4">
                                                        <div className="mb-4">
                                                               <img src="/assets/images/send_email.png" alt="Email sent" width={120} height={120} className="mx-auto" />
                                                        </div>
                                                        <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>{t('auth.check_email')}</h2>
                                                        <p className="text-muted small mb-4">
                                                               {t('auth.reset_link_sent_line_1')}<br />{t('auth.reset_link_sent_line_2')}
                                                        </p>
                                                        <button
                                                               className="form-button-1"
                                                               onClick={() => {
                                                                      setForgotMessage("");
                                                                      setCurrentStep("loginEmail");
                                                               }}
                                                        >
                                                               {t('auth.back_to_login')}
                                                        </button>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div className="text-center">
                                                               <img src="/assets/images/forgetpassword.svg" className="mx-auto mt-4 mb-4" alt="Forgot password illustration" />
                                                               <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>{t('auth.forgot_your_password')}</h2>
                                                               <p className="text-muted small mb-4">
                                                                      {t('auth.forgot_password_hint')}
                                                               </p>
                                                        </div>

                                                        <div className="mb-3">
                                                               <input
                                                                      type="email"
                                                                      placeholder={t('auth.enter_email')}
                                                                      value={forgotEmail}
                                                                      onChange={(e) => setForgotEmail(e.target.value)}
                                                                      className="form-control"
                                                                      style={{
                                                                             marginBottom: '20px', width: '100%', borderRadius: '12px', height: '68px',
                                                                             border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px',
                                                                             color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c', fontWeight: '600', padding: '0 20px'
                                                                      }}
                                                               />
                                                               {forgotErrors.email && <div className="text-danger small mt-1">{Array.isArray(forgotErrors.email) ? forgotErrors.email[0] : forgotErrors.email}</div>}
                                                        </div>

                                                        <button className="form-button-1" onClick={handleForgotPassword} disabled={forgotProcessing}>
                                                               {forgotProcessing ? t('auth.sending') : t('auth.send_link')}
                                                        </button>
                                                 </>
                                          )}
                                   </div>
                            )}

                            {currentStep === "forgotPasswordPhone" && (
                                   <div id="forgotPasswordPhoneStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
                                          <div className="step-heading-and-back">
                                                 <button
                                                        id="backForgotPasswordPhone"
                                                        onClick={() => {
                                                               setForgotPhoneErrors({});
                                                               setCurrentStep("phoneLogin");
                                                        }}
                                                        style={{
                                                               position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
                                                        }}
                                                 >
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_or_signup')}</h3>
                                          </div>

                                          <div className="text-center">
                                                 <img src="/assets/images/forgetpassword.svg" className="mx-auto mt-4 mb-4" alt="Forgot password illustration" />
                                                 <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>{t('auth.forgot_your_password')}</h2>
                                                 <p className="text-muted small mb-4">
                                                        {t('auth.forgot_password_phone_hint')}
                                                 </p>
                                          </div>

                                          <div className="mb-3">
                                                 <select
                                                        className="form-select border-0 bg-light rounded-3"
                                                        value={forgotPhoneData.countryCode}
                                                        onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, countryCode: e.target.value })}
                                                        style={{ width: '100%', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 >
                                                        <option value="+92">+92 PK</option>
                                                        <option value="+971">+971 UAE</option>
                                                 </select>
                                                 <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder={t('auth.enter_phone_number')}
                                                        value={forgotPhoneData.phone}
                                                        onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, phone: e.target.value.replace(/\D/g, "") })}
                                                        style={{ width: '100%', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 />
                                                 {forgotPhoneErrors.phone && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.phone}</div>}
                                          </div>

                                          <button className="form-button-1" onClick={handleSendForgotPhoneOtp} disabled={forgotPhoneProcessing}>
                                                 {forgotPhoneProcessing ? t('auth.sending') : t('auth.send_verification_code')}
                                          </button>
                                   </div>
                            )}

                            {currentStep === "forgotPasswordPhoneOtp" && (
                                   <div id="forgotPasswordPhoneOtpStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
                                          <div className="step-heading-and-back">
                                                 <button
                                                        id="backForgotPasswordPhoneOtp"
                                                        onClick={() => {
                                                               setForgotPhoneErrors({});
                                                               setCurrentStep("forgotPasswordPhone");
                                                        }}
                                                        style={{
                                                               position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
                                                        }}
                                                 >
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_or_signup')}</h3>
                                          </div>

                                          <div className="text-center">
                                                 <h2 className="fw-bold mb-2 mt-3" style={{ fontSize: '22px' }}>{t('auth.verify_otp')}</h2>
                                                 <p className="text-muted small mb-4">
                                                        {t('auth.enter_whatsapp_otp_desc')}
                                                 </p>
                                          </div>

                                          <form onSubmit={handleVerifyForgotPhoneOtp}>
                                                 <div className="mb-3 d-flex justify-content-center gap-2">
                                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                                               <input
                                                                      key={index}
                                                                      id={`forgot-phone-otp-input-${index}`}
                                                                      type="text"
                                                                      maxLength={1}
                                                                      className="form-control text-center fw-bold fs-4"
                                                                      value={forgotPhoneData.otp[index] || ""}
                                                                      onChange={(e) => {
                                                                             const val = e.target.value.replace(/\D/g, "");
                                                                             if (!val) return;

                                                                             const newOtp = forgotPhoneData.otp.split("");
                                                                             newOtp[index] = val;
                                                                             const newOtpString = newOtp.join("");
                                                                             setForgotPhoneData({ ...forgotPhoneData, otp: newOtpString });

                                                                             if (index < 5) {
                                                                                    const nextInput = document.getElementById(`forgot-phone-otp-input-${index + 1}`);
                                                                                    if (nextInput) nextInput.focus();
                                                                             }
                                                                      }}
                                                                      onKeyDown={(e) => {
                                                                             if (e.key === "Backspace") {
                                                                                    if (!forgotPhoneData.otp[index] && index > 0) {
                                                                                           const prevInput = document.getElementById(`forgot-phone-otp-input-${index - 1}`);
                                                                                           if (prevInput) prevInput.focus();
                                                                                    } else {
                                                                                           const newOtp = forgotPhoneData.otp.split("");
                                                                                           newOtp[index] = "";
                                                                                           setForgotPhoneData({ ...forgotPhoneData, otp: newOtp.join("") });
                                                                                    }
                                                                             }
                                                                      }}
                                                                      onPaste={(e) => {
                                                                             e.preventDefault();
                                                                             const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                                                                             setForgotPhoneData({ ...forgotPhoneData, otp: pastedData });
                                                                      }}
                                                                      style={{ width: '50px', height: '60px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                               />
                                                        ))}
                                                 </div>

                                                 <div className="text-center mb-4">
                                                        <button
                                                               type="button"
                                                               className="btn btn-link text-decoration-none p-0 small text-dark fw-bold"
                                                               disabled={isForgotPhoneResendDisabled}
                                                               onClick={handleSendForgotPhoneOtp}
                                                        >
                                                               {isForgotPhoneResendDisabled ? `${t('auth.resend_in')} ${forgotPhoneResendTimer}s` : t('auth.resend_code')}
                                                        </button>
                                                 </div>

                                                 {forgotPhoneErrors.otp && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.otp}</div>}
                                                 {forgotPhoneErrors.general && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.general}</div>}

                                                 <button className="form-button-1" type="submit" disabled={forgotPhoneProcessing || forgotPhoneData.otp.length < 6}>
                                                        {forgotPhoneProcessing ? 'Verifying...' : (t('Verify') || 'Verify')}
                                                 </button>
                                          </form>
                                   </div>
                            )}

                            {currentStep === "forgotPasswordPhoneNewPassword" && (
                                   <div id="forgotPasswordPhoneNewPasswordStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
                                          <div className="step-heading-and-back">
                                                 <button
                                                        id="backForgotPasswordPhoneNewPassword"
                                                        onClick={() => {
                                                               setForgotPhoneErrors({});
                                                               setCurrentStep("forgotPasswordPhoneOtp");
                                                        }}
                                                        style={{
                                                               position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
                                                        }}
                                                 >
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </button>
                                                 <h3 className="mb-0 fw-bold">{t('auth.login_or_signup')}</h3>
                                          </div>

                                          <div className="text-center">
                                                 <h2 className="fw-bold mb-2 mt-3" style={{ fontSize: '22px' }}>{t('auth.set_new_password') || 'Set New Password'}</h2>
                                                 <p className="text-muted small mb-4">
                                                        {t('auth.set_new_password_desc') || 'Create a strong new password for your account.'}
                                                 </p>
                                          </div>

                                          <form onSubmit={handleResetPhonePassword}>
                                                 <div className="mb-3 position-relative">
                                                        <input
                                                               type={showForgotPhonePassword ? "text" : "password"}
                                                               placeholder={t('auth.enter_new_password')}
                                                               value={forgotPhoneData.password}
                                                               onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, password: e.target.value })}
                                                               className="form-control"
                                                               required
                                                               style={{ paddingRight: '40px', marginBottom: '16px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c', paddingLeft: '20px' }}
                                                        />
                                                        <button
                                                               type="button"
                                                               className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                                                               onClick={() => setShowForgotPhonePassword(!showForgotPhonePassword)}
                                                               style={{ right: '10px', top: '34px' }}
                                                        >
                                                               <i className={`fa-solid ${showForgotPhonePassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </button>
                                                 </div>

                                                 <div className="mb-3 position-relative">
                                                        <input
                                                               type={showForgotPhoneConfirmPassword ? "text" : "password"}
                                                               placeholder={t('auth.confirm_new_password')}
                                                               value={forgotPhoneData.password_confirmation}
                                                               onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, password_confirmation: e.target.value })}
                                                               className="form-control"
                                                               required
                                                               style={{ paddingRight: '40px', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c', paddingLeft: '20px' }}
                                                        />
                                                        <button
                                                               type="button"
                                                               className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                                                               onClick={() => setShowForgotPhoneConfirmPassword(!showForgotPhoneConfirmPassword)}
                                                               style={{ right: '10px', top: '34px' }}
                                                        >
                                                               <i className={`fa-solid ${showForgotPhoneConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </button>
                                                 </div>

                                                 {forgotPhoneErrors.password && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.password}</div>}
                                                 {forgotPhoneErrors.password_confirmation && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.password_confirmation}</div>}
                                                 {forgotPhoneErrors.general && <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.general}</div>}

                                                 <button className="form-button-1" type="submit" disabled={forgotPhoneProcessing}>
                                                        {forgotPhoneProcessing ? t('auth.sending') : t('auth.reset_password')}
                                                 </button>
                                          </form>
                                   </div>
                            )}

                            {currentStep === "forgotPasswordPhoneSuccess" && (
                                   <div id="forgotPasswordPhoneSuccessStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
                                          <div className="text-center py-4">
                                                 <div className="mb-4">
                                                        <img src="/assets/images/send_email.png" alt="Success" width={120} height={120} className="mx-auto" />
                                                 </div>
                                                 <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>{t('auth.password_reset_success')}</h2>
                                                 <p className="text-muted small mb-4">
                                                        {t('auth.password_reset_success_desc')}
                                                 </p>
                                                 <button
                                                        className="form-button-1"
                                                        onClick={() => {
                                                               setPhoneData(prev => ({ ...prev, phone: forgotPhoneData.phone, countryCode: forgotPhoneData.countryCode, password: "" }));
                                                               setErrorMessage("");
                                                               setCurrentStep("phoneLogin");
                                                        }}
                                                 >
                                                        {t('auth.back_to_login')}
                                                 </button>
                                          </div>
                                   </div>
                            )}
                     </div>
              </div>
       );
};

export default LoginModal;
