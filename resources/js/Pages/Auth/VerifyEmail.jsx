import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
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
                        We sent a verification link to{' '}
                        <span>{auth?.user?.email || 'your email address'}</span>.
                        Please verify your email before continuing.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="verify-email-alert verify-email-alert--success">
                            A new verification link has been sent.
                        </div>
                    )}

                    {status === 'verification-link-failed' && (
                        <div className="verify-email-alert verify-email-alert--error">
                            We could not send the verification email right now.
                            Please try again later.
                        </div>
                    )}

                    <form onSubmit={submit} className="verify-email-modal__actions">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="verify-email-modal__logout"
                        >
                            Log Out
                        </Link>
                    </form>
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
                    gap: 14px;
                    flex-wrap: wrap;
                    margin: 0;
                }
                .verify-email-modal__actions button {
                    min-height: 44px;
                }
                .verify-email-modal__logout {
                    border: 0;
                    background: transparent;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: underline;
                    cursor: pointer;
                    min-height: 44px;
                    padding: 0 4px;
                }
                .verify-email-modal__logout:hover {
                    color: #23262f;
                }
                @media (max-width: 640px) {
                    .verify-email-shell {
                        min-height: 46vh;
                    }
                    .verify-email-modal {
                        padding: 24px 18px;
                    }
                    .verify-email-modal__actions {
                        align-items: stretch;
                        flex-direction: column;
                    }
                    .verify-email-modal__actions button,
                    .verify-email-modal__logout {
                        width: 100%;
                    }
                }
            `}</style>
        </AppLayout>
    );
}
