"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  googleAuthUrl,
  registerWithEmail,
  sendAuthOtp,
  verifyAuthOtp,
} from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { assetImage, mainUrl } from "@/lib/site";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: Props) {
  const { setSession } = useAuth();
  const [activeStep, setActiveStep] = useState("step1");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    countryCode: "+92",
    otp: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setActiveStep("step1");
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      countryCode: "+92",
      otp: "",
    });
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

  const setField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  const handleEmailRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const result = await registerWithEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (!result.token || !result.user) {
        throw new Error("Registration succeeded but session was incomplete.");
      }
      await setSession(result.token, result.user, result.redirect_url);
      return;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  const registerWithPhone = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
      await sendAuthOtp({
        phone: formattedPhone,
        type: "register",
        otp_type: "sms",
      });
      setActiveStep("otpVerification");
      startTimer();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
      const result = await verifyAuthOtp({
        phone: formattedPhone,
        otp: formData.otp,
        name: formData.name,
        password: formData.password,
      });
      if (!result.token || !result.user) {
        throw new Error("Verification succeeded but session was incomplete.");
      }
      await setSession(result.token, result.user, result.redirect_url);
      return;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid OTP.");
      setLoading(false);
    }
  };

  const updateOtpDigit = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 1) {
      const nextOtp = digits.slice(0, 6);
      setField("otp", nextOtp);
      otpInputRefs.current[Math.min(nextOtp.length, 5)]?.focus();
      return;
    }

    const otpDigits = (formData.otp || "").padEnd(6, " ").split("");
    otpDigits[index] = digits;
    const nextOtp = otpDigits.join("").replace(/\s/g, "");
    setField("otp", nextOtp);

    if (digits && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !(formData.otp || "")[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      id="SignupModal"
      className="signupModal video-modal"
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1060,
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`signupmodal-content ${activeStep === "otpVerification" ? "signupmodal-content--otp" : ""}`}
        style={{
          position: "relative",
          margin: "50px auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
        }}
      >
        <span
          className="close-btn"
          style={{ position: "absolute", right: "20px", top: "20px", cursor: "pointer", zIndex: 10 }}
          onClick={onClose}
          role="button"
          tabIndex={0}
        >
          <i
            className="fa-solid fa-xmark"
            style={{
              backgroundColor: "#EDEDED",
              color: "#23262F",
              padding: "6px 8px",
              fontSize: "12px",
              borderRadius: "100%",
            }}
          />
        </span>

        {activeStep === "step1" && (
          <div className="text-center">
            <h2 className="mb-4 fw-bold text-center">Sign Up</h2>

            <button
              type="button"
              onClick={() => {
                window.location.href = googleAuthUrl();
              }}
              className="signUpContinueIcon"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("googleLogo.svg")} alt="Google" width={20} className="me-2" />
              Continue with Google
            </button>

            <button type="button" className="signUpContinueIcon" disabled>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("appleLogo.svg")} alt="Apple" width={20} className="me-2" />
              Continue with Apple
            </button>

            <button type="button" onClick={() => setActiveStep("emailSignup")} className="signUpContinueIcon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("smsLogo.svg")} alt="Email" width={20} className="me-2" />
              Sign up with Email
            </button>

            <button type="button" onClick={() => setActiveStep("phoneSignup")} className="signUpContinueIcon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("MobileLogo.svg")} alt="Phone" width={20} className="me-2" />
              Sign up with Phone
            </button>

            <p className="small text-left text-muted my-4">
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
          </div>
        )}

        {activeStep === "emailSignup" && (
          <div id="stepEmail">
            <div className="step-heading-and-back">
              <button type="button" id="backEmail" onClick={() => setActiveStep("step1")}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Sign up with Email</h3>
            </div>

            <form onSubmit={handleEmailRegister}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setField("password", e.target.value)}
                  required
                />
              </div>

              {errorMessage ? <div className="alert-message">{errorMessage}</div> : null}

              <button className="form-button-1" disabled={loading}>
                {loading ? "Creating account..." : "Continue"}
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small text-muted">Already have an account? </span>
              <button
                type="button"
                className="btn btn-link text-decoration-underline p-0 small text-dark fw-bold"
                onClick={onSwitchToLogin}
              >
                Login
              </button>
            </div>
          </div>
        )}

        {activeStep === "phoneSignup" && (
          <div id="phoneSignup">
            <div className="step-heading-and-back">
              <button type="button" className="backbuttonSignup" onClick={() => setActiveStep("step1")}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Sign up with Phone</h3>
            </div>

            <div className="mb-3">
              <div className="steps-input-select">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group steps-input-select d-flex">
                <select
                  className="form-select w-auto flex-grow-0 bg-light border-end-0 rounded-start-3"
                  value={formData.countryCode}
                  onChange={(e) => setField("countryCode", e.target.value)}
                  style={{ maxWidth: "120px", marginBottom: "20px", borderRadius: "12px 0 0 12px" }}
                >
                  <option value="+92">+92 PK</option>
                  <option value="+971">+971 UAE</option>
                </select>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
                  style={{ borderRadius: "0 12px 12px 0" }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="steps-input-select">
                <input
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setField("password", e.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage ? <div className="alert-message">{errorMessage}</div> : null}

            <button type="button" className="form-button-1" disabled={loading} onClick={registerWithPhone}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {activeStep === "otpVerification" && (
          <div id="emailOtp-container" className="signup-otp-panel">
            <div className="step-heading-and-back signup-otp-header">
              <button
                type="button"
                className="backbuttonSignup signup-otp-back"
                onClick={() => setActiveStep("phoneSignup")}
                aria-label="Back"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h3 className="mb-0 fw-bold">Verify OTP</h3>
            </div>

            <p className="signup-otp-copy">
              Enter the OTP sent to{" "}
              <span>
                {formData.countryCode}
                {formData.phone}
              </span>
            </p>

            <div
              className="signup-otp-input-wrap"
              onPaste={(e) => {
                e.preventDefault();
                updateOtpDigit(0, e.clipboardData.getData("text"));
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  className="form-control signup-otp-input"
                  maxLength={1}
                  value={(formData.otp || "")[index] || ""}
                  onChange={(e) => updateOtpDigit(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {errorMessage ? <div className="alert-message">{errorMessage}</div> : null}

            <button
              type="button"
              className="form-button-1 signup-otp-submit"
              disabled={loading || !formData.otp || formData.otp.length < 6}
              onClick={handleVerifyPhoneOtp}
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>

            <div className="signup-otp-resend">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 small fw-bold"
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
}
