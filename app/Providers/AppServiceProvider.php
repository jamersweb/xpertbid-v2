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
        Vite::prefetch(concurrency: 3);

        Event::listen(MessageSent::class, LogSentEmail::class);

        Gate::policy(BuyerRequest::class, BuyerRequestPolicy::class);
        Gate::policy(BuyerRequestOffer::class, BuyerRequestOfferPolicy::class);
    }
}
