<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use stdClass;

class SendAllEmailPreviews extends Command
{
    protected $signature = 'emails:send-previews {recipient=connecttoabdulrehman01@gmail.com}';

    protected $description = 'Send all email template previews to one recipient address';

    public function handle(): int
    {
        $recipient = (string) $this->argument('recipient');
        $views = $this->emailViews();
        $data = $this->sampleData();

        $this->info("Sending " . count($views) . " email previews to: {$recipient}");

        $sent = 0;
        $failed = 0;

        foreach ($views as $view) {
            try {
                Mail::send($view, $data, function ($message) use ($recipient, $view) {
                    $message->to($recipient)
                        ->subject('Preview: ' . Str::of($view)->after('emails.')->replace('.', ' ')->title());
                });

                $sent++;
                $this->line("Sent: {$view}");
            } catch (\Throwable $e) {
                $failed++;
                $this->error("Failed: {$view} => {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("Done. Sent: {$sent}, Failed: {$failed}");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function emailViews(): array
    {
        $base = resource_path('views/emails');
        $files = glob($base . '/**/*.blade.php', GLOB_BRACE);
        $files = array_merge($files ?: [], glob($base . '/*.blade.php') ?: []);
        $files = array_unique($files);
        sort($files);

        $views = [];
        foreach ($files as $file) {
            $normalized = str_replace(['\\', '/'], DIRECTORY_SEPARATOR, $file);
            $viewsRoot = str_replace(['\\', '/'], DIRECTORY_SEPARATOR, resource_path('views') . DIRECTORY_SEPARATOR);
            $relative = str_replace($viewsRoot, '', $normalized);
            $view = str_replace(DIRECTORY_SEPARATOR, '.', $relative);
            $view = str_replace('.blade.php', '', $view);

            if ($view === 'emails.layouts.master' || $view === 'emails.template_preview') {
                continue;
            }

            $views[] = $view;
        }

        return $views;
    }

    private function sampleData(): array
    {
        $user = (object) [
            'id' => 2219,
            'name' => 'Abdul Rehman',
            'email' => 'connecttoabdulrehman01@gmail.com',
            'phone' => '+92 300 0000000',
            'signup_source' => 'web',
        ];

        $listing = (object) [
            'id' => 9081,
            'title' => 'Toyota Land Cruiser 2020',
        ];

        $item = (object) [
            'listing_id' => 9081,
            'quantity' => 1,
            'price' => 1500000,
            'subtotal' => 1500000,
            'auction' => $listing,
        ];

        $order = (object) [
            'is_promotion' => false,
            'order_number' => 'XB-2026-00091',
            'created_at' => Carbon::now(),
            'total' => 1500000,
            'payment_method' => 'bank_transfer',
            'payment_status' => 'pending',
            'billing_name' => 'Abdul Rehman',
            'billing_email' => 'connecttoabdulrehman01@gmail.com',
            'billing_phone' => '+92 300 0000000',
            'shipping_name' => 'Abdul Rehman',
            'shipping_address_line1' => 'House 123, Main Blvd',
            'shipping_address_line2' => 'Near Central Park',
            'shipping_city' => 'Lahore',
            'shipping_state' => 'Punjab',
            'shipping_postal_code' => '54000',
            'shipping_country' => 'Pakistan',
            'shipping_phone' => '+92 300 0000000',
            'shipping_email' => 'connecttoabdulrehman01@gmail.com',
            'items' => collect([$item]),
        ];

        $auction = (object) [
            'id' => 9081,
            'slug' => 'toyota-land-cruiser-2020',
            'title' => 'Toyota Land Cruiser 2020',
            'decline_reason' => 'Please upload clear registration documents.',
            'album' => ['/assets/images/hero-prodcut1.jpg'],
            'image' => '/assets/images/hero-prodcut1.jpg',
            'category_id' => 11,
            'category' => (object) ['name' => 'Vehicles'],
            'user' => $user,
            'start_date' => Carbon::now()->subDay(),
            'end_date' => Carbon::now()->addDays(3),
            'reserve_price' => 1400000,
            'minimum_bid' => 100000,
            'product_year' => 2020,
            'product_location' => 'Dubai',
            'developer' => null,
        ];

        $inquiry = (object) [
            'listing_id' => 9081,
            'auction_id' => 9081,
            'auction_title' => 'Toyota Land Cruiser 2020',
            'full_name' => 'Abdul Rehman',
            'email' => 'connecttoabdulrehman01@gmail.com',
            'phone' => '+92 300 0000000',
            'user_id' => 2219,
            'message' => 'Please share buy-now final amount and delivery timeline.',
        ];

        return [
            'user' => $user,
            'order' => $order,
            'items' => collect([$item]),
            'listing' => $listing,
            'auction' => $auction,
            'inquiry' => $inquiry,
            'reason' => 'Submitted document image is blurred.',
            'resubmitUrl' => url('/identity-verification'),
            'status' => 'pending',
            'note' => 'Please upload high-resolution images.',
            'oldStatus' => 'draft',
            'newStatus' => 'resubmit',
            'firstName' => 'Abdul Rehman',
            'name' => 'Abdul Rehman',
            'changeType' => 'Email Address Update',
            'timestamp' => Carbon::now()->format('F d, Y h:i A'),
            'listingTitle' => 'Toyota Land Cruiser 2020',
            'auctionEnds' => Carbon::now()->addDays(2)->format('F d, Y h:i A'),
            'winningBidAmount' => 'AED 1,500,000',
            'yourBidAmount' => 'AED 1,450,000',
            'auctionEnded' => Carbon::now()->subHour()->format('F d, Y h:i A'),
            'completePaymentLink' => url('/checkout'),
            'dashboardLink' => url('/dashboard'),
            'editUrl' => url('/sell'),
            'heading' => 'Auction Update',
            'bodyMessage' => 'Your auction result is ready.',
            'messageText' => 'Your auction result is ready.',
            'winningBid' => 1500000,
            'code' => '123456',
        ];
    }
}
