"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  forgotPassword,
  googleAuthUrl,
  loginWithPassword,
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
      </div>
    </div>
  );
}
