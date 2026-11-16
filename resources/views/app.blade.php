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

        <!-- Critical Core Stylesheets (Prevent FOUC) -->
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="/assets/css/style.css">

        <!-- FontAwesome (Asynchronous / Non-blocking) -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </noscript>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-X80DHQXSJD"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X80DHQXSJD');
        </script>
        <script>
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u9z69ioedc");
        </script>
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        @foreach (\App\Support\SchemaMarkup::blocksFromInertiaPage($page ?? []) as $index => $schemaBlock)
            <script type="application/ld+json" data-inertia-jsonld="{{ $index }}">{!! $schemaBlock !!}</script>
        @endforeach
    </head>
    <body class="font-sans antialiased" style="background: #fff !important;">
        @inertia
        
        <!-- Defer Non-critical JavaScript (Do not block HTML parsing) -->
        <script src="/assets/js/bootstrap.bundle.js" defer></script>
        <script src="/assets/js/script.js" defer></script>
    </body>
</html>
