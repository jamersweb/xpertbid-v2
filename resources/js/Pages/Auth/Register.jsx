import { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';

export default function Register() {
    const { t } = useTranslate();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AppLayout title={t('auth.register')}>
            <Head title={t('auth.register')} />

            <div className="container-fluid py-5" style={{ background: '#f8f9fa', minHeight: '80vh' }}>
                <div className="login-form-step">
                    <div className="step-heading-and-back text-center mb-4">
                        <h3 className="fw-bold">{t('auth.create_account')}</h3>
                    </div>

                    <form onSubmit={submit} className="auth-input-group">
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">{t('auth.name')}</label>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder={t('auth.full_name')}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">{t('auth.email')}</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="name@example.com"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">{t('auth.password')}</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder={t('auth.create_password')}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted">{t('auth.confirm_password')}</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder={t('auth.confirm_password_placeholder')}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && <div className="text-danger small mt-1">{errors.password_confirmation}</div>}
                        </div>

                        <button className="form-button-1" disabled={processing}>
                            {processing ? t('auth.registering') : t('auth.register')}
                        </button>

                        <div className="text-center mt-4">
                            <Link
                                href={route('login')}
                                className="small text-muted text-decoration-none"
                            >
                                {t('auth.already_have_account')} <span className="fw-bold text-dark text-decoration-underline">{t('auth.log_in')}</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
