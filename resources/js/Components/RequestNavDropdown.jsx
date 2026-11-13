import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTranslate from '@/hooks/useTranslate';

export default function RequestNavDropdown({
    isRtl = false,
    currentUrl = '',
    onPostRequestClick,
    onNavigate,
}) {
    const { t } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const isPostActive = currentUrl?.startsWith('/buyer-requests/create');
    const isViewActive = currentUrl?.startsWith('/seller/buyer-requests');
    const isTriggerActive = isOpen || isPostActive || isViewActive;

    const clearCloseTimer = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 992) return;
        clearCloseTimer();
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 992) return;
        clearCloseTimer();
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 180);
    };

    useEffect(() => {
        const handleOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('keydown', handleEscape);
            clearCloseTimer();
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [currentUrl]);

    return (
        <li
            ref={dropdownRef}
            className={`nav-item request-nav-item ${isOpen ? 'is-open' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                className={`btn nav-link request-nav-trigger ${isTriggerActive ? 'is-active' : ''}`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{t('Request')}</span>
                <i
                    className={`fa-solid fa-chevron-down request-nav-chevron ${isOpen ? 'is-open' : ''}`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div
                    className={`request-dropdown-menu ${isRtl ? 'is-rtl' : ''}`}
                    role="menu"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link
                        href={route('buyer-requests.create')}
                        className={`request-dropdown-item ${isPostActive ? 'is-active' : ''}`}
                        role="menuitem"
                        onClick={(e) => {
                            setIsOpen(false);
                            onPostRequestClick?.(e);
                        }}
                    >
                        <i className="fa-solid fa-pen-to-square request-dropdown-icon" aria-hidden="true" />
                        <span>{t('Post Request')}</span>
                    </Link>
                    <Link
                        href={route('seller.buyer-requests.browse')}
                        className={`request-dropdown-item ${isViewActive ? 'is-active' : ''}`}
                        role="menuitem"
                        onClick={() => {
                            setIsOpen(false);
                            onNavigate?.();
                        }}
                    >
                        <i className="fa-solid fa-list-check request-dropdown-icon" aria-hidden="true" />
                        <span>{t('View Request')}</span>
                    </Link>
                </div>
            )}
        </li>
    );
}

