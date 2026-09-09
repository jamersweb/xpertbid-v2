"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  forgotPassword,
  googleAuthUrl,
  loginWithPassword,
  resetPasswordWithPhone,
  sendAuthOtp,
  validateResetOtp,
} from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { assetImage, mainUrl } from "@/lib/site";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
};

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: Props) {
  const { setSession } = useAuth();
  const [currentStep, setCurrentStep] = useState("loginStep");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [phoneData, setPhoneData] = useState({
    phone: "",
    password: "",
    countryCode: "+92",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotErrors, setForgotErrors] = useState<string>("");
  const [forgotProcessing, setForgotProcessing] = useState(false);

  // Phone Forgot Password State
  const [forgotPhoneData, setForgotPhoneData] = useState({
    phone: "",
    countryCode: "+92",
    otp: "",
    password: "",
    password_confirmation: "",
  });
  const [forgotPhoneErrors, setForgotPhoneErrors] = useState<Record<string, string>>({});
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
    if (forgotPhoneData.phone.replace(/\D/g, "").length < 7) {
      setForgotPhoneErrors({ phone: "Please enter a valid phone number." });
      return;
    }
    setForgotPhoneErrors({});
    setForgotPhoneProcessing(true);
    try {
      const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
      await sendAuthOtp({
        phone: formattedPhone,
        type: "forgot_password",
        otp_type: "whatsapp",
      });
      setCurrentStep("forgotPasswordPhoneOtp");
      startForgotPhoneTimer();
    } catch (err) {
      setForgotPhoneErrors({ phone: err instanceof Error ? err.message : "Failed to send OTP." });
    } finally {
      setForgotPhoneProcessing(false);
    }
  };

  const handleVerifyForgotPhoneOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (forgotPhoneData.otp.length < 6) {
      setForgotPhoneErrors({ otp: "Please enter complete 6-digit OTP." });
      return;
    }
    setForgotPhoneErrors({});
    setForgotPhoneProcessing(true);
    try {
      const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
      await validateResetOtp({
        phone: formattedPhone,
        otp: forgotPhoneData.otp,
      });
      setCurrentStep("forgotPasswordPhoneNewPassword");
    } catch (err) {
      setForgotPhoneErrors({ otp: err instanceof Error ? err.message : "Invalid or expired OTP." });
    } finally {
      setForgotPhoneProcessing(false);
    }
  };

  const handleResetPhonePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (forgotPhoneData.otp.length < 6) {
      setForgotPhoneErrors({ otp: "Please enter complete 6-digit OTP." });
      return;
    }
    if (!forgotPhoneData.password || forgotPhoneData.password.length < 6) {
      setForgotPhoneErrors({ password: "Password must be at least 6 characters." });
      return;
    }
    if (forgotPhoneData.password !== forgotPhoneData.password_confirmation) {
      setForgotPhoneErrors({ password_confirmation: "Passwords do not match." });
      return;
    }
    setForgotPhoneErrors({});
    setForgotPhoneProcessing(true);
    try {
      const formattedPhone = `${forgotPhoneData.countryCode}${forgotPhoneData.phone.replace(/^0+/, "")}`;
      await resetPasswordWithPhone({
        phone: formattedPhone,
        otp: forgotPhoneData.otp,
        password: forgotPhoneData.password,
        password_confirmation: forgotPhoneData.password_confirmation,
      });
      setCurrentStep("forgotPasswordPhoneSuccess");
    } catch (err) {
      setForgotPhoneErrors({ general: err instanceof Error ? err.message : "Failed to reset password." });
    } finally {
      setForgotPhoneProcessing(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep("loginStep");
    setErrorMessage("");
    setShowPassword(false);
    setForgotMessage("");
    setForgotErrors("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setProcessing(true);
    try {
      const result = await loginWithPassword({ email, password, remember });
      if (!result.token || !result.user) {
        throw new Error("Login succeeded but session was incomplete.");
      }
      // Navigates away via /auth/bridge → sets main-site session → back here.
      await setSession(result.token, result.user, result.redirect_url);
      return;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid credentials.");
      setProcessing(false);
    }
  };

  const handlePhoneLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (phoneData.phone.replace(/\D/g, "").length < 7) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }
    if (!phoneData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setErrorMessage("");
    setProcessing(true);
    const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;

    try {
      const result = await loginWithPassword({
        email: formattedPhone,
        password: phoneData.password,
        remember: true,
      });
      if (!result.token || !result.user) {
        throw new Error("Login succeeded but session was incomplete.");
      }
      await setSession(result.token, result.user, result.redirect_url);
      return;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid credentials.");
      setProcessing(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotErrors("");
    setForgotProcessing(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotMessage("sent");
    } catch (err) {
      setForgotErrors(err instanceof Error ? err.message : "Failed to send reset link.");
    } finally {
      setForgotProcessing(false);
    }
  };

  return (
    <div className="loginModal" style={{ display: "block" }} role="dialog" aria-modal="true">
      <div className="loginModal-content">
        <span className="close-btn" id="closeLoginModal" onClick={onClose} role="button" tabIndex={0}>
          <i className="fa-solid fa-xmark" />
        </span>

        {currentStep === "loginStep" && (
          <div id="loginStep" className="login-form-step active text-center">
            <h3 className="mb-4 fw-bold">Login or Sign up</h3>

            <button type="button" onClick={() => setCurrentStep("phoneLogin")} className="loginContinueIcon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("MobileLogo.svg")} alt="Phone" width={20} className="me-2" />
              Continue with Phone
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = googleAuthUrl();
              }}
              className="loginContinueIcon"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("googleLogo.svg")} alt="Google" width={20} className="me-2" />
              Continue with Google
            </button>

            <button type="button" onClick={() => setCurrentStep("loginEmail")} className="loginContinueIcon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("smsLogo.svg")} alt="Email" width={20} className="me-2" />
              Continue with Email
            </button>

            <button type="button" className="loginContinueIcon" disabled>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("appleLogo.svg")} alt="Apple" width={20} className="me-2" />
              Continue with Apple
            </button>

            <p className="small text-left text-muted mb-0 mt-3">
              By continuing, you agree to xpertBid{" "}
              <a href={mainUrl("/terms")} className="text-decoration-underline text-primary" onClick={onClose}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href={mainUrl("/privacy-policy")}
                className="text-decoration-underline text-primary"
                onClick={onClose}
              >
                Privacy Policy
              </a>
            </p>

            <div className="text-center mt-3">
              <span className="small text-muted">Don&apos;t have an account? </span>
              <button
                type="button"
                className="btn btn-link text-decoration-underline p-0 small text-dark fw-bold"
                onClick={onSwitchToRegister}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {currentStep === "phoneLogin" && (
          <div id="loginStep2" className="login-form-step">
            <div className="step-heading-and-back">
              <button type="button" id="backPhoneLogin" onClick={() => setCurrentStep("loginStep")}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login with Phone</h3>
            </div>

            <form onSubmit={handlePhoneLogin}>
              <div className="mb-3">
                <select
                  className="form-select border-0 bg-light rounded-3"
                  value={phoneData.countryCode}
                  onChange={(e) => setPhoneData({ ...phoneData, countryCode: e.target.value })}
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    height: "68px",
                    borderRadius: "12px",
                    border: "1px solid #FAFAFA",
                    backgroundColor: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#23262F",
                    boxShadow: "15px 19px 50px 0 #0000001c",
                  }}
                >
                  <option value="+92">+92 PK</option>
                  <option value="+971">+971 UAE</option>
                </select>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phoneData.phone}
                  onChange={(e) =>
                    setPhoneData({ ...phoneData, phone: e.target.value.replace(/\D/g, "") })
                  }
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    height: "68px",
                    borderRadius: "12px",
                    border: "1px solid #FAFAFA",
                    backgroundColor: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#23262F",
                    boxShadow: "15px 19px 50px 0 #0000001c",
                  }}
                />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={phoneData.password}
                  onChange={(e) => setPhoneData({ ...phoneData, password: e.target.value })}
                  className="form-control"
                  style={{
                    paddingRight: "40px",
                    marginBottom: "20px",
                    height: "68px",
                    borderRadius: "12px",
                    border: "1px solid #FAFAFA",
                    backgroundColor: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#23262F",
                    boxShadow: "15px 19px 50px 0 #0000001c",
                  }}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ right: "10px", top: "34px" }}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>

              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-link small text-dark fw-bold text-decoration-none p-0"
                  onClick={() => {
                    setForgotPhoneData({
                      phone: phoneData.phone,
                      countryCode: phoneData.countryCode,
                      otp: "",
                      password: "",
                      password_confirmation: "",
                    });
                    setForgotPhoneErrors({});
                    setCurrentStep("forgotPasswordPhone");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {errorMessage ? <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div> : null}

              <button className="form-button-1" type="submit" disabled={processing}>
                {processing ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        )}

        {currentStep === "loginEmail" && (
          <div id="loginEmail" className="login-form-step">
            <div className="step-heading-and-back">
              <button type="button" id="backValidationLogin" onClick={() => setCurrentStep("loginStep")}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login with Email</h3>
            </div>

            <form onSubmit={handleEmailLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ right: "10px", top: "34px" }}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 login-email-meta">
                <label className="login-remember mb-0" htmlFor="rememberMe">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="btn btn-link small text-dark fw-bold text-decoration-none p-0"
                  onClick={() => setCurrentStep("forgotPassword")}
                >
                  Forgot password?
                </button>
              </div>

              {errorMessage ? <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div> : null}

              <button className="form-button-1" disabled={processing}>
                {processing ? "Logging in..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {currentStep === "forgotPassword" && (
          <div id="forgotPasswordStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
            <div className="step-heading-and-back">
              <button
                type="button"
                id="backForgotPassword"
                onClick={() => {
                  setForgotMessage("");
                  setCurrentStep("loginEmail");
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login or Sign up</h3>
            </div>

            {forgotMessage === "sent" ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={assetImage("send_email.png")}
                    alt="Email sent"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </div>
                <h2 className="fw-bold mb-3" style={{ fontSize: "24px" }}>
                  Check your email
                </h2>
                <p className="text-muted small mb-4">
                  We sent a password reset link to your email.
                </p>
                <button
                  type="button"
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
              <form onSubmit={handleForgotPassword}>
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={assetImage("forgetpassword.svg")}
                    className="mx-auto mt-4 mb-4"
                    alt="Forgot password illustration"
                  />
                  <h2 className="fw-bold mb-3" style={{ fontSize: "24px" }}>
                    Forgot your password?
                  </h2>
                  <p className="text-muted small mb-4">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="form-control"
                    required
                    style={{
                      marginBottom: "20px",
                      width: "100%",
                      borderRadius: "12px",
                      height: "68px",
                      border: "1px solid #FAFAFA",
                      backgroundColor: "#FAFAFA",
                      fontSize: "18px",
                      color: "#23262F",
                      boxShadow: "15px 19px 50px 0 #0000001c",
                      fontWeight: 600,
                      padding: "0 20px",
                    }}
                  />
                  {forgotErrors ? <div className="text-danger small mt-1">{forgotErrors}</div> : null}
                </div>

                <button className="form-button-1" type="submit" disabled={forgotProcessing}>
                  {forgotProcessing ? "Sending..." : "Send link"}
                </button>
              </form>
            )}
          </div>
        )}

        {currentStep === "forgotPasswordPhone" && (
          <div id="forgotPasswordPhoneStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
            <div className="step-heading-and-back">
              <button
                type="button"
                id="backForgotPasswordPhone"
                onClick={() => {
                  setForgotPhoneErrors({});
                  setCurrentStep("phoneLogin");
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login or Sign up</h3>
            </div>

            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetImage("forgetpassword.svg")}
                className="mx-auto mt-4 mb-4"
                alt="Forgot password illustration"
              />
              <h2 className="fw-bold mb-3" style={{ fontSize: "24px" }}>
                Forgot your password?
              </h2>
              <p className="text-muted small mb-4">
                Enter your phone number to receive a verification code via WhatsApp.
              </p>
            </div>

            <div className="mb-3">
              <select
                className="form-select border-0 bg-light rounded-3"
                value={forgotPhoneData.countryCode}
                onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, countryCode: e.target.value })}
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  height: "68px",
                  borderRadius: "12px",
                  border: "1px solid #FAFAFA",
                  backgroundColor: "#FAFAFA",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#23262F",
                  boxShadow: "15px 19px 50px 0 #0000001c",
                }}
              >
                <option value="+92">+92 PK</option>
                <option value="+971">+971 UAE</option>
              </select>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                value={forgotPhoneData.phone}
                onChange={(e) =>
                  setForgotPhoneData({ ...forgotPhoneData, phone: e.target.value.replace(/\D/g, "") })
                }
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  height: "68px",
                  borderRadius: "12px",
                  border: "1px solid #FAFAFA",
                  backgroundColor: "#FAFAFA",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#23262F",
                  boxShadow: "15px 19px 50px 0 #0000001c",
                }}
              />
              {forgotPhoneErrors.phone ? (
                <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.phone}</div>
              ) : null}
            </div>

            <button
              className="form-button-1"
              type="button"
              onClick={handleSendForgotPhoneOtp}
              disabled={forgotPhoneProcessing}
            >
              {forgotPhoneProcessing ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {currentStep === "forgotPasswordPhoneOtp" && (
          <div id="forgotPasswordPhoneOtpStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
            <div className="step-heading-and-back">
              <button
                type="button"
                id="backForgotPasswordPhoneOtp"
                onClick={() => {
                  setForgotPhoneErrors({});
                  setCurrentStep("forgotPasswordPhone");
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login or Sign up</h3>
            </div>

            <div className="text-center">
              <h2 className="fw-bold mb-2 mt-3" style={{ fontSize: "22px" }}>
                Verify OTP
              </h2>
              <p className="text-muted small mb-4">
                Enter the 6-digit code sent to your WhatsApp.
              </p>
            </div>

            <form onSubmit={handleVerifyForgotPhoneOtp}>
              <div className="mb-3 d-flex justify-content-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`next-forgot-phone-otp-${index}`}
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
                        const nextEl = document.getElementById(`next-forgot-phone-otp-${index + 1}`);
                        if (nextEl) nextEl.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        if (!forgotPhoneData.otp[index] && index > 0) {
                          const prevEl = document.getElementById(`next-forgot-phone-otp-${index - 1}`);
                          if (prevEl) prevEl.focus();
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
                    style={{
                      width: "50px",
                      height: "60px",
                      borderRadius: "12px",
                      border: "1px solid #FAFAFA",
                      backgroundColor: "#FAFAFA",
                      boxShadow: "15px 19px 50px 0 #0000001c",
                    }}
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
                  {isForgotPhoneResendDisabled ? `Resend in ${forgotPhoneResendTimer}s` : "Resend code"}
                </button>
              </div>

              {forgotPhoneErrors.otp ? (
                <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.otp}</div>
              ) : null}
              {forgotPhoneErrors.general ? (
                <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.general}</div>
              ) : null}

              <button
                className="form-button-1"
                type="submit"
                disabled={forgotPhoneProcessing || forgotPhoneData.otp.length < 6}
              >
                {forgotPhoneProcessing ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        )}

        {currentStep === "forgotPasswordPhoneNewPassword" && (
          <div id="forgotPasswordPhoneNewPasswordStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
            <div className="step-heading-and-back">
              <button
                type="button"
                id="backForgotPasswordPhoneNewPassword"
                onClick={() => {
                  setForgotPhoneErrors({});
                  setCurrentStep("forgotPasswordPhoneOtp");
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Login or Sign up</h3>
            </div>

            <div className="text-center">
              <h2 className="fw-bold mb-2 mt-3" style={{ fontSize: "22px" }}>
                Set New Password
              </h2>
              <p className="text-muted small mb-4">
                Create a strong new password for your account.
              </p>
            </div>

            <form onSubmit={handleResetPhonePassword}>
              <div className="mb-3 position-relative">
                <input
                  type={showForgotPhonePassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={forgotPhoneData.password}
                  onChange={(e) => setForgotPhoneData({ ...forgotPhoneData, password: e.target.value })}
                  className="form-control"
                  required
                  style={{
                    paddingRight: "40px",
                    marginBottom: "16px",
                    height: "68px",
                    borderRadius: "12px",
                    border: "1px solid #FAFAFA",
                    backgroundColor: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#23262F",
                    boxShadow: "15px 19px 50px 0 #0000001c",
                    paddingLeft: "20px",
                  }}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                  onClick={() => setShowForgotPhonePassword(!showForgotPhonePassword)}
                  style={{ right: "10px", top: "34px" }}
                >
                  <i className={`fa-solid ${showForgotPhonePassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={showForgotPhoneConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={forgotPhoneData.password_confirmation}
                  onChange={(e) =>
                    setForgotPhoneData({ ...forgotPhoneData, password_confirmation: e.target.value })
                  }
                  className="form-control"
                  required
                  style={{
                    paddingRight: "40px",
                    marginBottom: "20px",
                    height: "68px",
                    borderRadius: "12px",
                    border: "1px solid #FAFAFA",
                    backgroundColor: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#23262F",
                    boxShadow: "15px 19px 50px 0 #0000001c",
                    paddingLeft: "20px",
                  }}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted"
                  onClick={() => setShowForgotPhoneConfirmPassword(!showForgotPhoneConfirmPassword)}
                  style={{ right: "10px", top: "34px" }}
                >
                  <i className={`fa-solid ${showForgotPhoneConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>

              {forgotPhoneErrors.password ? (
                <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.password}</div>
              ) : null}
              {forgotPhoneErrors.password_confirmation ? (
                <div className="alert alert-danger py-2 small mb-3">
                  {forgotPhoneErrors.password_confirmation}
                </div>
              ) : null}
              {forgotPhoneErrors.general ? (
                <div className="alert alert-danger py-2 small mb-3">{forgotPhoneErrors.general}</div>
              ) : null}

              <button
                className="form-button-1"
                type="submit"
                disabled={forgotPhoneProcessing}
              >
                {forgotPhoneProcessing ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        )}

        {currentStep === "forgotPasswordPhoneSuccess" && (
          <div id="forgotPasswordPhoneSuccessStep" className="login-form-step" style={{ backgroundColor: "#ffffff" }}>
            <div className="text-center py-4">
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetImage("send_email.png")}
                  alt="Success"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>
              <h2 className="fw-bold mb-3" style={{ fontSize: "24px" }}>
                Password Reset Successful
              </h2>
              <p className="text-muted small mb-4">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <button
                type="button"
                className="form-button-1"
                onClick={() => {
                  setPhoneData((prev) => ({
                    ...prev,
                    phone: forgotPhoneData.phone,
                    countryCode: forgotPhoneData.countryCode,
                    password: "",
                  }));
                  setErrorMessage("");
                  setCurrentStep("phoneLogin");
                }}
              >
                Back to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
