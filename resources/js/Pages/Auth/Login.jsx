import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [step, setStep] = useState('main'); // main, email, phone
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const [phoneData, setPhoneData] = useState({ phone: '', otp: '', otp_type: 'sms' });
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phoneErrors, setPhoneErrors] = useState({});

    const sendOtp = async () => {
        setLoading(true);
        setPhoneErrors({});
        try {
            const response = await axios.post('/api/auth/send-otp', {
                phone: phoneData.phone,
                type: 'login',
                otp_type: phoneData.otp_type
            });
            setOtpSent(true);
        } catch (error) {
            setPhoneErrors(error.response?.data?.errors || { phone: error.response?.data?.message || 'Failed to send OTP' });
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setPhoneErrors({});
        try {
            const response = await axios.post('/api/auth/verify-otp', {
                phone: phoneData.phone,
                otp: phoneData.otp
            });
            // On success, redirect to dashboard or intended route
            router.visit(route('dashboard'));
        } catch (error) {
            setPhoneErrors(error.response?.data?.errors || { otp: error.response?.data?.message || 'Invalid OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = route('auth.google');
    };

    return (
        <AppLayout title="Log in">
            <Head title="Log in" />

            <div className="container-fluid py-5" style={{ background: '#f8f9fa', minHeight: '80vh' }}>

                {step === 'main' && (
                    <div className="login-form-step text-center">
                        <h3 className="mb-4 fw-bold">Login or Sign up</h3>

                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                        <button onClick={() => { setStep('phone'); setPhoneData({ ...phoneData, otp_type: 'whatsapp' }); }} className="loginContinueIcon">
                            <i className="fa-brands fa-whatsapp me-2 fs-5 text-success"></i>
                            Continue with WhatsApp
                        </button>

                        <button onClick={() => { setStep('phone'); setPhoneData({ ...phoneData, otp_type: 'sms' }); }} className="loginContinueIcon">
                            <i className="fa-solid fa-mobile-screen me-2 fs-5"></i>
                            Continue with Phone
                        </button>

                        <button onClick={handleGoogleLogin} className="loginContinueIcon">
                            <i className="fa-brands fa-google me-2 fs-5 text-danger"></i>
                            Continue with Google
                        </button>

                        <button onClick={() => setStep('email')} className="loginContinueIcon">
                            <i className="fa-regular fa-envelope me-2 fs-5"></i>
                            Continue with Email
                        </button>

                        <p className="mt-4 text-muted small">
                            By continuing, I agree to  xpertBid <Link href={route('terms')} className="text-decoration-underline text-primary">Terms of service</Link> and <Link href={route('privacy.policy')} className="text-decoration-underline text-primary">Privacy policy</Link>.
                        </p>
                    </div>
                )}

                {step === 'email' && (
                    <div className="login-form-step">
                        <div className="step-heading-and-back">
                            <button id="backPhoneLogin" onClick={() => setStep('main')}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <h3>Login with Email</h3>
                        </div>

                        <form onSubmit={submit} className="auth-input-group">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                            </div>

                            <div className="mt-3">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                                <label className="d-flex align-items-center small text-muted">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="me-2"
                                        style={{ width: 'auto', margin: 0 }}
                                    />
                                    Remember me
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="small text-decoration-none text-dark fw-bold"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>

                            <button className="form-button-1" disabled={processing}>
                                {processing ? 'Logging in...' : 'Continue'}
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-muted small">Don't have an account? </span>
                                <Link href={route('register')} className="small fw-bold text-dark text-decoration-underline">Register</Link>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'phone' && (
                    <div className="login-form-step">
                        <div className="step-heading-and-back">
                            <button id="backPhoneLogin" onClick={() => setStep('main')}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <h3>Login with {phoneData.otp_type === 'whatsapp' ? 'WhatsApp' : 'Phone'}</h3>
                        </div>

                        <div className="auth-input-group">
                            {!otpSent ? (
                                <>
                                    <p className="text-center text-muted mb-4 small">Enter your phone number to receive a verification code via {phoneData.otp_type === 'whatsapp' ? 'WhatsApp' : 'SMS'}.</p>
                                    <div className="phone-input-wrapper mb-4">
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number (e.g., 923...)"
                                            value={phoneData.phone}
                                            onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                                            className="w-full"
                                        />
                                        {phoneErrors.phone && <div className="text-danger small mt-1">{phoneErrors.phone}</div>}
                                    </div>
                                    <button
                                        onClick={sendOtp}
                                        className="form-button-1"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-center text-muted mb-4 small">An OTP has been sent to {phoneData.phone}.</p>
                                    <div className="otp-input-wrapper mb-4">
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={phoneData.otp}
                                            onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                            maxLength={6}
                                            className="w-full text-center tracking-widest font-bold text-xl"
                                        />
                                        {phoneErrors.otp && <div className="text-danger small mt-1">{phoneErrors.otp}</div>}
                                    </div>
                                    <button
                                        onClick={verifyOtp}
                                        className="form-button-1"
                                        disabled={loading}
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Login'}
                                    </button>
                                    <div className="text-center mt-3">
                                        <button onClick={() => setOtpSent(false)} className="btn btn-link btn-sm text-dark text-decoration-none">
                                            Change Phone Number
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
