import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    HiOutlineArrowLeft,
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiOutlineEye,
    HiOutlineLightBulb,
    HiOutlineQuestionMarkCircle,
    HiOutlineStatusOnline,
    HiOutlineX,
} from 'react-icons/hi';
import useTranslate from '@/hooks/useTranslate';

const statusPill = (status) => {
    const map = {
        open: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        closed: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
        fulfilled: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    };
    return map[status] || map.closed;
};

function formatPostedDate(value) {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return '—';
    }
}

function TipsPanel({ t }) {
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 text-sm sm:p-5">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                <HiOutlineLightBulb className="h-5 w-5 text-amber-500" />
                {t('Tips for quick offers')}
            </div>
            <ul className="space-y-2 text-slate-600">
                <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {t('Describe what you need clearly (specs, quantity, brand)')}
                </li>
                <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {t('Include reference images')}
                </li>
                <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {t('Mention preferred delivery or completion timeline')}
                </li>
                <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {t('Set a realistic target budget')}
                </li>
                <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {t('Add your area so nearby sellers can offer')}
                </li>
            </ul>
        </div>
    );
}

function SummaryPanel({ t, buyerRequest }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
            <h2 className="text-sm font-semibold text-gray-900">{t('Request summary')}</h2>
            <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-1.5 text-slate-500">
                        <HiOutlineStatusOnline className="h-4 w-4" />
                        {t('Status')}
                    </dt>
                    <dd>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusPill(buyerRequest.status)}`}
                        >
                            {buyerRequest.status}
                        </span>
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-1.5 text-slate-500">
                        <HiOutlineClipboardList className="h-4 w-4" />
                        {t('Offers')}
                    </dt>
                    <dd className="font-semibold text-slate-900">
                        {buyerRequest.offers_count ?? buyerRequest.offers?.length ?? 0}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-1.5 text-slate-500">
                        <HiOutlineCalendar className="h-4 w-4" />
                        {t('Created')}
                    </dt>
                    <dd className="font-medium text-slate-700">
                        {formatPostedDate(buyerRequest.created_at)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

function NextStepsPanel({ t }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
            <h2 className="text-sm font-semibold text-gray-900">{t('What happens next?')}</h2>
            <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
                <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        1
                    </span>
                    {t('Matched sellers get notified')}
                </li>
                <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        2
                    </span>
                    {t('Compare offers and chat')}
                </li>
                <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        3
                    </span>
                    {t('Accept the best offer')}
                </li>
            </ol>
        </div>
    );
}

export default function FormLayout({
    title,
    isEdit = false,
    buyerRequest = null,
    submitting = false,
    onSubmit,
    submitLabel,
    submittingLabel,
    children,
}) {
    const { t } = useTranslate();
    const [helpOpen, setHelpOpen] = useState(false);

    useEffect(() => {
        if (!helpOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') setHelpOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [helpOpen]);

    const helpPanels = (
        <div className="space-y-4">
            <TipsPanel t={t} />
            {isEdit && buyerRequest ? (
                <SummaryPanel t={t} buyerRequest={buyerRequest} />
            ) : (
                <NextStepsPanel t={t} />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 sm:pb-8">
            <QuillStyles />
            <div className="mx-auto max-w-6xl px-2.5 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
                <div className="mb-4 sm:mb-6">
                    <Link
                        href={route('buyer-requests.index')}
                        className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        {t('Back to Requests')}
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                        {title}
                    </h1>
                </div>

                <form id="buyer-request-form" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                        <div className="space-y-4 lg:col-span-2 sm:space-y-5">{children}</div>

                        <aside className="hidden space-y-4 lg:col-span-1 lg:block lg:sticky lg:top-6 lg:self-start sm:space-y-5">
                            {helpPanels}

                            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
                                <div className="flex flex-col gap-2.5">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? submittingLabel : submitLabel}
                                    </button>
                                    <Link
                                        href={route('buyer-requests.index')}
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 no-underline transition hover:bg-slate-50"
                                    >
                                        {t('Cancel')}
                                    </Link>
                                    {isEdit && buyerRequest && (
                                        <Link
                                            href={route(
                                                'buyer-requests.show',
                                                buyerRequest.slug || buyerRequest
                                            )}
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900"
                                        >
                                            <HiOutlineEye className="h-4 w-4" />
                                            {t('View live request')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="mt-4 flex gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:mt-5 sm:p-4 lg:hidden">
                        <Link
                            href={route('buyer-requests.index')}
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 no-underline transition hover:bg-slate-50"
                        >
                            {t('Cancel')}
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex flex-[1.4] items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60"
                        >
                            {submitting ? submittingLabel : submitLabel}
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile help FAB — sits above WhatsApp */}
            <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="fixed z-[10000] inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:bg-slate-50 lg:hidden"
                style={{ right: 23, bottom: 150 }}
                aria-label={t('Help & summary')}
            >
                <HiOutlineQuestionMarkCircle className="h-7 w-7" />
            </button>

            {helpOpen && (
                <div className="fixed inset-0 z-[10050] lg:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/45 animate-[brHelpFade_0.35s_ease-out]"
                        aria-label={t('Close')}
                        onClick={() => setHelpOpen(false)}
                    />
                    <div className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col bg-slate-50 shadow-2xl animate-[brHelpSlide_0.38s_cubic-bezier(0.22,1,0.36,1)]">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5">
                            <h2 className="text-base font-semibold text-slate-900">
                                {isEdit ? t('Request summary') : t('Tips & next steps')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setHelpOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                                aria-label={t('Close')}
                            >
                                <HiOutlineX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">{helpPanels}</div>
                    </div>
                    <style>{`
                        @keyframes brHelpSlide {
                            from { transform: translateX(100%); opacity: 0.96; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes brHelpFade {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}

export function FormCard({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5 md:p-6">
            {(title || description) && (
                <div className="mb-4 sm:mb-5">
                    {title && (
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h2>
                    )}
                    {description && (
                        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                    )}
                </div>
            )}
            {children}
        </section>
    );
}

export function FieldLabel({ children, required = false }) {
    return (
        <label className="mb-1.5 block text-sm font-semibold text-slate-800">
            {children}
            {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
    );
}

export function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-rose-500">{message}</p>;
}

export const inputClass = (hasError = false) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
        hasError
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-gray-200 focus:border-slate-400 focus:ring-slate-100'
    }`;

/** Quill polish for the wizard cards */
export function QuillStyles() {
    return (
        <style>{`
            .br-quill .ql-toolbar.ql-snow {
                border: none;
                border-bottom: 1px solid #e5e7eb;
                background: #f8fafc;
                padding: 10px 12px;
            }
            .br-quill .ql-container.ql-snow {
                border: none;
                font-size: 14px;
                min-height: 140px;
                background: #fff;
                color: #0f172a;
            }
            .br-quill .ql-editor {
                min-height: 140px;
                padding: 14px 16px;
                color: #0f172a !important;
                background: #fff !important;
                cursor: text;
            }
            .br-quill .ql-editor p,
            .br-quill .ql-editor li,
            .br-quill .ql-editor span,
            .br-quill .ql-editor div {
                color: #0f172a !important;
            }
            .br-quill .ql-editor.ql-blank::before {
                left: 16px;
                right: 16px;
                font-style: normal;
                color: #94a3b8 !important;
                opacity: 1;
            }
        `}</style>
    );
}
