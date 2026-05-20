<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\MsgpkService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('currency:sync-rates')->everySixHours();
Schedule::command('auction:check-status')->everyMinute();
Schedule::command('verification:send-24h-reminders')->hourly();
Schedule::command('verification:send-post-verify-inactivity-reminders')->hourly();

Artisan::command('msgpk:send-ali-karim', function () {
    $mobile = '+923198212626';
    $message = <<<'MSG'
Hi Ali Karim,👋

You're just one step away from accessing live property auctions on Boli.ae 🚀

Here’s what you’re currently missing:

🏡 2BR in JVC starting @ 1.2M AED
🌴 2BR Palm property @ 2.25M AED
🏙 Studios from just 330K AED

⏳ Some auctions are closing in the next few days.

To start bidding, simply complete your quick verification:

👉 https://boli.ae/profile-settings?tab=kyc

✅ Takes only a few minutes
🔒 100% secure process
✅ No Commissions

Once verified, you’ll get full access to all live listings.

Need help? Just reply here - we’ll assist you.
MSG;

    $sent = app(MsgpkService::class)->sendMessage($mobile, $message);

    if ($sent) {
        $this->info("Message sent successfully to {$mobile}");
        return self::SUCCESS;
    }

    $this->error("Failed to send message to {$mobile}. Check storage/logs/laravel.log");
    return self::FAILURE;
})->purpose('Send Ali Karim template message via MsgPK');
