<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $supportedLocales = array_keys(config('locales.supported', []));
        $defaultLocale = config('app.locale', 'en');
        $sessionLocale = $request->session()->get('locale', $defaultLocale);
        $locale = in_array($sessionLocale, $supportedLocales, true) ? $sessionLocale : $defaultLocale;

        App::setLocale($locale);

        return $next($request);
    }
}
