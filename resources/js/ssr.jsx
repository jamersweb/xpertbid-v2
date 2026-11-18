import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            const ziggy = page?.props?.ziggy;
            const ziggyConfig = ziggy
                ? {
                    ...ziggy,
                    location: ziggy.location ? new URL(ziggy.location) : undefined,
                }
                : undefined;

            if (ziggyConfig) {
                globalThis.Ziggy = ziggyConfig;
            }

            globalThis.route = (name, params, absolute, config = ziggyConfig) =>
                route(name, params, absolute, config);

            return <App {...props} />;
        },
    }),
);
