import { useState, useEffect } from "react";
import { Link, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from "axios";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
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

       // Forgot Password State
       const [forgotEmail, setForgotEmail] = useState("");
       const [forgotMessage, setForgotMessage] = useState("");
       const [forgotErrors, setForgotErrors] = useState({});
       const [forgotProcessing, setForgotProcessing] = useState(false);

       const handleForgotPassword = async (e) => {
              e.preventDefault();
              setForgotErrors({});
              setForgotProcessing(true);
              try {
                     await axios.post("https://admin.xpertbid.com/api/forgot-password", { email: forgotEmail });
                     setForgotMessage("sent");
              } catch (error) {
                     setForgotErrors(error.response?.data?.error || { email: "Failed to send link. Please try again." });
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
                            setErrorMessage(err.email || "Invalid credentials");
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
                     setErrorMessage("Invalid phone number.");
                     return;
              }
              if (!phoneData.password) {
                     setErrorMessage("Please enter your password.");
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
                            setErrorMessage(err.email || "Invalid credentials. If you forgot your password, please use Forgot Password.");
                     }
              });
       };

       const sendOtp = async () => {
              if (!validatePhoneNumber(phoneData.phone)) {
                     setErrorMessage("Invalid phone number.");
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
                     setErrorMessage(error.response?.data?.message || "Failed to send OTP");
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
                     setErrorMessage(error.response?.data?.message || "Invalid OTP");
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
                                          <h3 className="mb-4 fw-bold">Login or Sign up</h3>

                                          <button onClick={() => handleContinueWithPhone('sms')} className="loginContinueIcon">
                                                 <img src="/assets/images/MobileLogo.svg" alt="Phone" width={20} className="me-2" />
                                                 Continue with Phone
                                          </button>

                                          <button onClick={handleGoogleLogin} className="loginContinueIcon">
                                                 <img src="/assets/images/googleLogo.svg" alt="Google" width={20} className="me-2" />
                                                 Continue with Google
                                          </button>

                                          <button onClick={() => setCurrentStep("loginEmail")} className="loginContinueIcon">
                                                 <img src="/assets/images/smsLogo.svg" alt="Email" width={20} className="me-2" />
                                                 Continue with Email
                                          </button>

                                          {/* Placeholder for Apple Login - functionality to be implemented */}
                                          <button className="loginContinueIcon">
                                                 <img src="/assets/images/appleLogo.svg" alt="Apple" width={20} className="me-2" />
                                                 Continue with Apple
                                          </button>

                                          <p className="small text-left text-muted mb-0 mt-3">
                                                 By continuing, I agree to xpertBid <Link href="/terms" className="text-decoration-underline text-primary" onClick={onClose}>Terms of service</Link> and <Link href="/privacy-policy" className="text-decoration-underline text-primary" onClick={onClose}>privacy policy.</Link>
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
                                                 <h3 className="mb-0 fw-bold">Login with Phone</h3>
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
                                                        placeholder="Enter Phone Number"
                                                        value={phoneData.phone}
                                                        onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value.replace(/\D/g, "") })}
                                                        style={{ width: '100%', marginBottom: '20px', height: '68px', borderRadius: '12px', border: '1px solid #FAFAFA', backgroundColor: '#FAFAFA', fontSize: '18px', fontWeight: '600', color: '#23262F', boxShadow: '15px 19px 50px 0 #0000001c' }}
                                                 />
                                          </div>

                                          <div className="mb-3 position-relative">
                                                 <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter Password"
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

                                          {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}

                                          <p className="mt-2 mb-4 text-muted small">Enter your phone number and password to login.</p>

                                          <button className="form-button-1" onClick={handlePhoneLogin}>
                                                 Login
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
                                                 <h3 className="mb-0 fw-bold">Verify OTP</h3>
                                          </div>

                                          <p className="mb-4 small text-muted text-center">Enter the OTP sent to {phoneData.countryCode}{phoneData.phone}</p>

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
                                                 Verify & Login
                                          </button>

                                          <div className="text-center mt-3">
                                                 <button
                                                        className="btn btn-link text-decoration-none p-0 small text-dark fw-bold"
                                                        disabled={isResendDisabled}
                                                        onClick={sendOtp}
                                                 >
                                                        {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"}
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
                                                 <h3 className="mb-0 fw-bold">Login with Email</h3>
                                          </div>

                                          <form onSubmit={handleEmailLogin}>
                                                 <div className="mb-3">
                                                        <input
                                                               type="email"
                                                               placeholder="Enter your email"
                                                               value={emailData.email}
                                                               onChange={(e) => setEmailData('email', e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 <div className="mb-3 position-relative">
                                                        <input
                                                               type={showPassword ? "text" : "password"}
                                                               placeholder="Enter password"
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
                                                        <div className="form-check mb-0">
                                                               <input
                                                                      className="form-check-input"
                                                                      type="checkbox"
                                                                      id="rememberMe"
                                                                      checked={emailData.remember}
                                                                      onChange={(e) => setEmailData('remember', e.target.checked)}
                                                                      style={{ marginTop: '0.2rem' }}
                                                               />
                                                               <label className="form-check-label small text-muted ms-2" htmlFor="rememberMe" style={{ paddingTop: '1px' }}>
                                                                      Remember me
                                                               </label>
                                                        </div>
                                                        <button
                                                               type="button"
                                                               className="btn btn-link small text-dark fw-bold text-decoration-none p-0"
                                                               onClick={() => setCurrentStep("forgotPassword")}
                                                        >
                                                               Forgot Password?
                                                        </button>
                                                 </div>

                                                 {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}

                                                 <button className="form-button-1" disabled={emailProcessing}>
                                                        {emailProcessing ? "Logging in..." : "Continue"}
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
                                                 <h3 className="mb-0 fw-bold">Login or Sign up</h3>
                                          </div>

                                          {forgotMessage === "sent" ? (
                                                 <div className="text-center py-4">
                                                        <div className="mb-4">
                                                               <img src="/assets/images/send_email.png" alt="Email sent" width={120} height={120} className="mx-auto" />
                                                        </div>
                                                        <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>Please Check your email</h2>
                                                        <p className="text-muted small mb-4">
                                                               We sent password reset link to your email. Sometimes<br /> it shows in spam folder so please do check that.
                                                        </p>
                                                        <button
                                                               className="form-button-1"
                                                               onClick={() => {
                                                                      setForgotMessage("");
                                                                      setCurrentStep("loginEmail");
                                                               }}
                                                        >
                                                               Back to login
                                                        </button>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div className="text-center">
                                                               <img src="/assets/images/forgetpassword.svg" className="mx-auto mt-4 mb-4" alt="Forgot password illustration" />
                                                               <h2 className="fw-bold mb-3" style={{ fontSize: '24px' }}>Forgot your password?</h2>
                                                               <p className="text-muted small mb-4">
                                                                      Enter your registered email to get a new password link.
                                                               </p>
                                                        </div>

                                                        <div className="mb-3">
                                                               <input
                                                                      type="email"
                                                                      placeholder="Enter your email"
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
                                                               {forgotProcessing ? "Sending..." : "Send Link"}
                                                        </button>
                                                 </>
                                          )}
                                   </div>
                            )}
                     </div>
              </div>
       );
};

export default LoginModal;
