import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let hasReloadedForExpiredSession = false;

window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 419 && typeof window !== 'undefined' && !hasReloadedForExpiredSession) {
            hasReloadedForExpiredSession = true;
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

window.Echo = null;

if (typeof window !== 'undefined' && import.meta.env.VITE_REVERB_APP_KEY) {
    const loadEcho = () => import('./echo');
    const path = window.location.pathname || '/';
    const needsImmediateRealtime = /^\/(chat|buyer-requests|seller\/buyer-requests|product|auctions|live)/i.test(path);

    if (needsImmediateRealtime) {
        loadEcho();
    } else {
        const triggerLazyEcho = () => {
            setTimeout(loadEcho, 3000);
        };
        if (document.readyState === 'complete') {
            triggerLazyEcho();
        } else {
            window.addEventListener('load', triggerLazyEcho, { once: true });
        }
    }
}
