<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ \App\Support\OpenGraphMeta::pageTitle($page ?? []) }}</title>
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/assets/images/expertbid-favicon.png">

        <!-- Open Graph / Twitter / SEO Meta Tags -->
        {!! \App\Support\OpenGraphMeta::renderHtml($page ?? []) !!}

        <!-- Preconnect to External Font & CDN Domains -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
        <link rel="dns-prefetch" href="https://www.googletagmanager.com">
        <link rel="dns-prefetch" href="https://connect.facebook.net">

        <!-- Google Fonts (Non-blocking with display=swap) -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap">
        </noscript>

        <meta name="google-site-verification" content="zGSFYzf1ujXjinXH0Zc3omSpyfqzxY8LhA1luOXlbaY">
        <meta name="facebook-domain-verification" content="kg7z4wzekhjupblgcueaip41jpd6a5">

        @if(request()->is('/', 'marketplace') || request()->routeIs('home', 'marketplace'))
        <!-- Homepage Hero Banner LCP Preload (Immediate Discovery before React Hydration) -->
        <link rel="preload" as="image" href="/assets/images/mob1.webp" type="image/webp" media="(max-width: 767px)" fetchpriority="high">
        <link rel="preload" as="image" href="/assets/images/newwban1.webp" type="image/webp" media="(min-width: 768px)" fetchpriority="high">
        @endif

        <!-- Critical Core Stylesheets (Purged + Minified to Prevent FOUC & Reduce Unused CSS) -->
        <link rel="preload" href="/assets/css/bootstrap.purged.min.css" as="style">
        <link rel="stylesheet" href="/assets/css/bootstrap.purged.min.css">

        <!-- Critical Above-The-Fold Styles & Font-Display Swap Override -->
        <style>
            body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; background: #fff !important; }
            *, ::after, ::before { box-sizing: border-box; }
            a { text-decoration: none !important; }
            .sellnow {
                padding: 10px 20px;
                border: 1px solid #23262F;
                border-radius: 8px;
                color: #fff !important;
                background-color: #23262F;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .registration-btns button.signup {
                padding: 8px 16px;
                border: 1px solid #43ace9;
                border-radius: 6px;
                color: #43ace9;
                background-color: transparent;
                font-weight: 600;
            }
            .registration-btns button.login {
                color: #606060;
                font-weight: 600;
                border: 0;
                background-color: transparent;
            }
            /* FontAwesome font-display: swap override to eliminate FOIT (Flash of Invisible Text) */
            @font-face {
                font-family: 'Font Awesome 6 Free';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2") format("woff2");
            }
            @font-face {
                font-family: 'Font Awesome 6 Free';
                font-style: normal;
                font-weight: 900;
                font-display: swap;
                src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2") format("woff2");
            }
            @font-face {
                font-family: 'Font Awesome 6 Brands';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2") format("woff2");
            }
            @font-face {
                font-family: 'FontAwesome';
                font-style: normal;
                font-weight: normal;
                font-display: swap;
                src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2") format("woff2");
            }
            /* Above-the-fold layout stability (Prevents Desktop & Mobile CLS before Swiper & async CSS load) */
            .xp-brand-top-banner {
                min-height: 70px;
                padding: 8px 48px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            #mainNavbar {
                min-height: 68px;
            }
            #mainNavbar .logo-image {
                height: 40px !important;
                max-height: 40px !important;
                width: auto !important;
            }
            .hero-banner-shell,
            .hero-slider,
            .hero-slider .swiper-wrapper,
            .hero-slider .swiper-slide {
                height: 420px;
                min-height: 420px;
                border-radius: 32px;
                overflow: hidden;
            }
            @media (min-width: 1500px) {
                .final-banner-section .container {
                    max-width: 1380px;
                }
            }
            .browsecategories {
                padding: 50px 70px;
            }
            .categories-slider {
                min-height: 164px;
                overflow: hidden;
            }
            .home-section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                margin-bottom: 24px;
            }
            .featured-heading h2 {
                font-size: 35px;
                font-weight: 800;
                line-height: 48px;
                margin: 0;
                color: #23262F;
            }
            .section-view-all-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 44px;
                padding: 10px 18px;
                border-radius: 10px;
                background: #fff;
                color: #101828;
                font-size: 14px;
                font-weight: 600;
            }
            @media (max-width: 992px) {
                .browsecategories {
                    padding: 20px;
                }
            }
            @media (max-width: 991px) {
                .hero-banner-shell,
                .hero-slider,
                .hero-slider .swiper-wrapper,
                .hero-slider .swiper-slide {
                    height: 360px;
                    min-height: 360px;
                }
            }
            @media (max-width: 768px) {
                .xp-brand-top-banner {
                    min-height: 52px;
                    padding: 8px 10px;
                }
                .browsecategories {
                    padding: 20px 5px;
                }
            }
            @media (max-width: 767px) {
                .hero-banner-shell,
                .hero-slider,
                .hero-slider .swiper-wrapper,
                .hero-slider .swiper-slide {
                    height: 210px;
                    min-height: 210px;
                    border-radius: 24px;
                }
                .categories-slider {
                    min-height: 140px;
                }
                .home-section-header {
                    padding-left: 16px;
                    padding-right: 16px;
                    margin-bottom: 18px;
                }
                .home-section-header .featured-heading h2 {
                    font-size: 20px;
                    line-height: 1.2;
                }
                .section-view-all-btn {
                    min-height: 40px;
                    padding: 8px 14px;
                    font-size: 13px;
                    white-space: nowrap;
                }
            }
            /* Off-screen content rendering optimization (Skips off-screen layout & paint) */
            .content-visibility-auto {
                content-visibility: auto;
                contain-intrinsic-size: auto 420px;
            }
            .footer.content-visibility-auto {
                content-visibility: auto;
                contain-intrinsic-size: auto 320px;
            }
        </style>

        <!-- Secondary Custom Styles (Non-blocking async load minified) -->
        <link rel="stylesheet" href="/assets/css/style.min.css" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="/assets/css/style.min.css">
        </noscript>

        <!-- FontAwesome (Asynchronous / Non-blocking) -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </noscript>

        <!-- Delayed 3rd-Party Analytics & Tracking Scripts (Prevents Main-Thread Contention during Initial Hydration) -->
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X80DHQXSJD');

            (function() {
                var loaded = false;
                var events = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];

                function loadTracking() {
                    if (loaded) return;
                    loaded = true;

                    events.forEach(function(evt) {
                        window.removeEventListener(evt, loadTracking, { passive: true });
                    });

                    // 1. Google Analytics (gtag.js)
                    var gtagScript = document.createElement('script');
                    gtagScript.async = true;
                    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-X80DHQXSJD';
                    document.head.appendChild(gtagScript);

                    // 2. Microsoft Clarity
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "u9z69ioedc");
                }

                events.forEach(function(evt) {
                    window.addEventListener(evt, loadTracking, { passive: true, once: true });
                });

                function scheduleDeferredLoad() {
                    setTimeout(function() {
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(loadTracking, { timeout: 1500 });
                        } else {
                            loadTracking();
                        }
                    }, 3000);
                }

                if (document.readyState === 'complete') {
                    scheduleDeferredLoad();
                } else {
                    window.addEventListener('load', scheduleDeferredLoad, { once: true });
                }
            })();
        </script>
        
        @if(request()->is('admin', 'admin/*'))
            @routes('admin')
        @else
            @routes('public')
        @endif
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        @foreach (\App\Support\SchemaMarkup::blocksFromInertiaPage($page ?? []) as $index => $schemaBlock)
            <script type="application/ld+json" data-inertia-jsonld="{{ $index }}">{!! $schemaBlock !!}</script>
        @endforeach
    </head>
    <body class="font-sans antialiased" style="background: #fff !important;">
        @inertia
    </body>
</html>
