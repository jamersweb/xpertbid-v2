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

import './echo';
