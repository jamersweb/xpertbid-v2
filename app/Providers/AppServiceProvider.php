<?php

namespace App\Providers;

use App\Listeners\LogSentEmail;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestOffer;
use App\Policies\BuyerRequestOfferPolicy;
use App\Policies\BuyerRequestPolicy;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Only modulepreload critical entry chunks (app, react-vendor, inertia-vendor) and CSS
        // so secondary JS chunks do not compete with the Hero LCP image on Mobile Slow-4G.
        Vite::usePreloadTagAttributes(function (?string $src, string $url, ?array $chunk, ?array $manifest) {
            if (str_ends_with($url, '.css')) {
                return [];
            }

            $name = (string) ($chunk['name'] ?? '');
            if (in_array($name, ['app', 'react-vendor', 'inertia-vendor'], true)) {
                return [];
            }

            return false;
        });

        Event::listen(MessageSent::class, LogSentEmail::class);

        Gate::policy(BuyerRequest::class, BuyerRequestPolicy::class);
        Gate::policy(BuyerRequestOffer::class, BuyerRequestOfferPolicy::class);
    }
}
