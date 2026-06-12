<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RememberReturnUrl
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('GET') && ! $request->is('product/*')) {
            $request->session()->put('last_return_url', $request->fullUrl());
        }

        return $next($request);
    }
}
