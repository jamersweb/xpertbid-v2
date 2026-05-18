import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function VerifyEmail({ status }) {
    const { auth } = usePage().props;
    const otpInputRefs = useRef([]);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
    } = useForm({
        code: '',
    });
    const resendForm = useForm({});

    const updateCodeDigit = (index, value) => {
        clearErrors('code');
        const digits = value.replace(/\D/g, '');

        if (digits.length > 1) {
            const nextCode = digits.slice(0, 6);
            setData('code', nextCode);
            otpInputRefs.current[Math.min(nextCode.length, 5)]?.focus();
            return;
        }

        const codeDigits = (data.code || '').padEnd(6, ' ').split('');
        codeDigits[index] = digits;
        const nextCode = codeDigits.join('').replace(/\s/g, '');
        setData('code', nextCode);

        if (digits && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !(data.code || '')[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const verifyCode = (e) => {
        e.preventDefault();
        post(route('verification.code.verify'));
    };

    const resendCode = (e) => {
        e.preventDefault();
        resendForm.post(route('verification.send'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Email Verification">
            <Head title="Email Verification" />

            <div className="verify-email-shell" aria-hidden="true">
                <div className="verify-email-shell__inner" />
            </div>

            <Modal show={true} closeable={false} maxWidth="md">
                <div className="verify-email-modal">
                    <div className="verify-email-modal__icon">
                        <i className="fa-regular fa-envelope"></i>
                    </div>

                    <h2>Verify your email</h2>

                    <p>
                        Enter the 6-digit verification code sent to{' '}
                        <span>{auth?.user?.email || 'your email address'}</span>.
                    </p>

                    {status === 'verification-code-sent' && (
                        <div className="verify-email-alert verify-email-alert--success">
                            A new verification code has been sent.
                        </div>
                    )}

                    {status === 'verification-code-failed' && (
                        <div className="verify-email-alert verify-email-alert--error">
                            We could not send the verification code right now.
                            Please try again later.
                        </div>
                    )}

                    <form onSubmit={verifyCode} className="verify-email-code-form">
                        <div
                            className="verify-email-code-inputs"
                            onPaste={(e) => {
                                e.preventDefault();
                                updateCodeDigit(0, e.clipboardData.getData('text'));
                            }}
                        >
                            {Array.from({ length: 6 }).map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (otpInputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={(data.code || '')[index] || ''}
                                    onChange={(e) => updateCodeDigit(index, e.target.value)}
                                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                    aria-label={`Verification code digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        {errors.code && (
                            <div className="verify-email-alert verify-email-alert--error">
                                {errors.code}
                            </div>
                        )}

                        <PrimaryButton disabled={processing || data.code.length < 6}>
                            {processing ? 'Verifying...' : 'Verify Email'}
                        </PrimaryButton>
                    </form>

                    <div className="verify-email-modal__actions">
                        <button
                            type="button"
                            className="verify-email-modal__link"
                            disabled={resendForm.processing}
                            onClick={resendCode}
                        >
                            {resendForm.processing ? 'Sending...' : 'Resend Code'}
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="verify-email-modal__link"
                        >
                            Log Out
                        </Link>
                    </div>
                </div>
            </Modal>

            <style>{`
                .verify-email-shell {
                    min-height: 54vh;
                    background: #f6f8fb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .verify-email-shell__inner {
                    width: min(720px, calc(100vw - 32px));
                    height: 220px;
                    border: 1px dashed #d8e0ea;
                    border-radius: 8px;
                    background: #ffffff;
                    opacity: 0.45;
                }
                .verify-email-modal {
                    padding: 30px;
                    text-align: center;
                    color: #23262f;
                }
                .verify-email-modal__icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 16px;
                    border-radius: 50%;
                    background: #eef8fe;
                    color: #43ace9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                }
                .verify-email-modal h2 {
                    margin: 0 0 10px;
                    font-size: 24px;
                    line-height: 1.25;
                    font-weight: 800;
                    letter-spacing: 0;
                }
                .verify-email-modal p {
                    margin: 0 auto 18px;
                    max-width: 390px;
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.6;
                }
                .verify-email-modal p span {
                    color: #23262f;
                    font-weight: 700;
                    overflow-wrap: anywhere;
                }
                .verify-email-code-form {
                    margin: 0;
                }
                .verify-email-code-inputs {
                    display: grid;
                    grid-template-columns: repeat(6, 46px);
                    justify-content: center;
                    gap: 8px;
                    margin: 18px 0;
                }
                .verify-email-code-inputs input {
                    width: 46px;
                    height: 52px;
                    border: 1px solid #d8e0ea;
                    border-radius: 8px;
                    background: #ffffff;
                    color: #23262f;
                    font-size: 22px;
                    font-weight: 800;
                    text-align: center;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .verify-email-code-inputs input:focus {
                    border-color: #43ace9;
                    box-shadow: 0 0 0 3px rgba(67, 172, 233, 0.16);
                }
                .verify-email-code-form > button {
                    min-height: 44px;
                    width: min(280px, 100%);
                    justify-content: center;
                }
                .verify-email-alert {
                    margin: 0 0 16px;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.45;
                }
                .verify-email-alert--success {
                    background: #ecfdf3;
                    color: #027a48;
                }
                .verify-email-alert--error {
                    background: #fff1f3;
                    color: #c01048;
                }
                .verify-email-modal__actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 18px;
                    flex-wrap: wrap;
                    margin-top: 18px;
                }
                .verify-email-modal__link {
                    border: 0;
                    background: transparent;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: underline;
                    cursor: pointer;
                    min-height: 36px;
                    padding: 0 4px;
                }
                .verify-email-modal__link:hover {
                    color: #23262f;
                }
                .verify-email-modal__link:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }
                @media (max-width: 640px) {
                    .verify-email-shell {
                        min-height: 46vh;
                    }
                    .verify-email-modal {
                        padding: 24px 18px;
                    }
                    .verify-email-code-inputs {
                        grid-template-columns: repeat(6, minmax(36px, 44px));
                        gap: 6px;
                    }
                    .verify-email-code-inputs input {
                        width: 100%;
                        height: 48px;
                    }
                    .verify-email-code-form > button {
                        width: 100%;
                    }
                }
            `}</style>
        </AppLayout>
    );
}
