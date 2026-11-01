<?php

namespace App\Support;

use App\Mail\BuyerRequestAlertMail;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestAlertLog;
use App\Models\User;
use App\Services\MsgpkService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Testing\Fakes\MailFake;

class BuyerRequestAlertSender
{
    public const KEY_MATCHED_REQUEST = 'matched_request';

    public const KEY_OFFER_RECEIVED = 'offer_received';

    public const KEY_OFFER_UPDATED = 'offer_updated';

    public const KEY_OFFER_WITHDRAWN = 'offer_withdrawn';

    public const KEY_OFFER_ACCEPTED = 'offer_accepted';

    public const KEY_OFFER_REJECTED = 'offer_rejected';

    public const KEY_REQUEST_CLOSED = 'request_closed';

    public static function send(User $user, string $key, BuyerRequest $request, array $context = []): void
    {
        $payload = self::buildPayload($user, $key, $request, $context);
        if ($payload === null) {
            return;
        }

        self::sendEmail($user, $key, $request, $payload);
        self::sendWhatsApp($user, $key, $request, $payload['whatsapp']);
    }

    /**
     * Resend a single channel only (email or whatsapp).
     */
    public static function sendChannel(
        User $user,
        string $key,
        BuyerRequest $request,
        string $channel,
        array $context = []
    ): void {
        $payload = self::buildPayload($user, $key, $request, $context);
        if ($payload === null) {
            return;
        }

        if ($channel === BuyerRequestAlertLog::CHANNEL_EMAIL) {
            self::sendEmail($user, $key, $request, $payload);

            return;
        }

        if ($channel === BuyerRequestAlertLog::CHANNEL_WHATSAPP) {
            self::sendWhatsApp($user, $key, $request, $payload['whatsapp']);
        }
    }

    public static function requestUrl(BuyerRequest $request): string
    {
        return route('buyer-requests.show', $request, absolute: true);
    }

    public static function browseUrl(): string
    {
        return route('seller.buyer-requests.browse', absolute: true);
    }

    public static function formatPrice(mixed $price): string
    {
        if ($price === null || $price === '') {
            return '—';
        }

        return number_format((float) $price).' PKR';
    }

    public static function buildPayload(User $user, string $key, BuyerRequest $request, array $context): ?array
    {
        $name = trim((string) ($user->name ?: 'there'));
        $firstName = trim((string) explode(' ', $name)[0]) ?: 'there';
        $title = trim((string) ($request->title ?: 'your request'));
        $requestUrl = self::requestUrl($request);
        $browseUrl = self::browseUrl();
        $price = array_key_exists('price', $context)
            ? self::formatPrice($context['price'])
            : null;

        return match ($key) {
            self::KEY_MATCHED_REQUEST => [
                'subject' => 'New buyer request matches your preferences',
                'heading' => 'New buyer request',
                'paragraphs' => [
                    'A new buyer request matches your seller preferences on XpertBid.',
                    'Open the request and submit your offer if you can fulfill it.',
                ],
                'details' => ['Request' => $title],
                'ctaLabel' => 'View request',
                'ctaUrl' => $requestUrl,
                'secondaryLabel' => null,
                'secondaryUrl' => null,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."A new buyer request matches your preferences on XpertBid.\n\n"
                    ."Request: {$title}\n\n"
                    ."View and offer: {$requestUrl}",
            ],
            self::KEY_OFFER_RECEIVED => [
                'subject' => 'New offer on your buyer request',
                'heading' => 'New offer received',
                'paragraphs' => [
                    'You received a new offer on your buyer request.',
                    'Review the offer and accept or reject it from your request page.',
                ],
                'details' => array_filter([
                    'Request' => $title,
                    'Offer price' => $price,
                ]),
                'ctaLabel' => 'Review offer',
                'ctaUrl' => $requestUrl,
                'secondaryLabel' => null,
                'secondaryUrl' => null,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."You received a new offer on \"{$title}\".\n"
                    .'Offer price: '.($price ?? '—')."\n\n"
                    ."Review: {$requestUrl}",
            ],
            self::KEY_OFFER_UPDATED => [
                'subject' => 'An offer was updated on your buyer request',
                'heading' => 'Offer updated',
                'paragraphs' => [
                    'A seller updated their offer on your buyer request.',
                    'Review the latest offer on your request page.',
                ],
                'details' => array_filter([
                    'Request' => $title,
                    'Updated price' => $price,
                ]),
                'ctaLabel' => 'View request',
                'ctaUrl' => $requestUrl,
                'secondaryLabel' => null,
                'secondaryUrl' => null,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."A seller updated their offer on \"{$title}\".\n"
                    .'Updated price: '.($price ?? '—')."\n\n"
                    ."Review: {$requestUrl}",
            ],
            self::KEY_OFFER_WITHDRAWN => [
                'subject' => 'An offer was withdrawn on your buyer request',
                'heading' => 'Offer withdrawn',
                'paragraphs' => [
                    'A seller withdrew their offer on your buyer request.',
                    'Other pending offers (if any) are still available on your request page.',
                ],
                'details' => ['Request' => $title],
                'ctaLabel' => 'View request',
                'ctaUrl' => $requestUrl,
                'secondaryLabel' => null,
                'secondaryUrl' => null,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."A seller withdrew their offer on \"{$title}\".\n\n"
                    ."View request: {$requestUrl}",
            ],
            self::KEY_OFFER_ACCEPTED => [
                'subject' => 'Your offer was accepted',
                'heading' => 'Offer accepted',
                'paragraphs' => [
                    'Great news — the buyer accepted your offer on XpertBid.',
                    'The buyer will contact XpertBid support to complete the purchase. Please stay available for next steps.',
                ],
                'details' => array_filter([
                    'Request' => $title,
                    'Accepted price' => $price,
                ]),
                'ctaLabel' => 'View request',
                'ctaUrl' => $requestUrl,
                'secondaryLabel' => null,
                'secondaryUrl' => null,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."Your offer on \"{$title}\" was accepted.\n"
                    .'Accepted price: '.($price ?? '—')."\n\n"
                    ."The buyer will contact XpertBid support to complete the purchase.\n\n"
                    ."View request: {$requestUrl}",
            ],
            self::KEY_OFFER_REJECTED => [
                'subject' => 'Update on your buyer-request offer',
                'heading' => 'Offer not selected',
                'paragraphs' => [
                    'Your offer on the following buyer request was not selected.',
                ],
                'details' => ['Request' => $title],
                'ctaLabel' => 'Browse requests',
                'ctaUrl' => $browseUrl,
                'secondaryLabel' => 'View this request',
                'secondaryUrl' => $requestUrl,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."Your offer on \"{$title}\" was not selected.\n\n"
                    ."This request: {$requestUrl}\n"
                    ."Browse other requests: {$browseUrl}",
            ],
            self::KEY_REQUEST_CLOSED => [
                'subject' => 'Buyer request closed',
                'heading' => 'Buyer request closed',
                'paragraphs' => [
                    'The buyer closed this request. New offers are no longer accepted.',
                ],
                'details' => ['Request' => $title],
                'ctaLabel' => 'Browse requests',
                'ctaUrl' => $browseUrl,
                'secondaryLabel' => 'View this request',
                'secondaryUrl' => $requestUrl,
                'whatsapp' => "Hi {$firstName},\n\n"
                    ."The buyer closed \"{$title}\". New offers are no longer accepted.\n\n"
                    ."This request: {$requestUrl}\n"
                    ."Browse other requests: {$browseUrl}",
            ],
            default => null,
        };
    }

    protected static function emailBodyFromPayload(array $payload): string
    {
        $parts = $payload['paragraphs'] ?? [];
        $lines = is_array($parts) ? $parts : [];

        foreach (($payload['details'] ?? []) as $label => $value) {
            $lines[] = "{$label}: {$value}";
        }

        if (! empty($payload['ctaLabel']) && ! empty($payload['ctaUrl'])) {
            $lines[] = $payload['ctaLabel'].': '.$payload['ctaUrl'];
        }

        if (! empty($payload['secondaryLabel']) && ! empty($payload['secondaryUrl'])) {
            $lines[] = $payload['secondaryLabel'].': '.$payload['secondaryUrl'];
        }

        return implode("\n\n", $lines);
    }

    protected static function sendEmail(User $user, string $key, BuyerRequest $request, array $payload): void
    {
        $email = trim((string) ($user->email ?? ''));
        $body = self::emailBodyFromPayload($payload);
        $subject = $payload['subject'] ?? null;

        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_EMAIL,
                $key,
                $email !== '' ? $email : null,
                $subject,
                $body,
                BuyerRequestAlertLog::STATUS_SKIPPED,
                'no_email'
            );

            return;
        }

        try {
            LoggedMail::to($email)->send(new BuyerRequestAlertMail(
                subjectLine: $payload['subject'],
                recipientName: trim((string) ($user->name ?: 'there')),
                heading: $payload['heading'],
                paragraphs: $payload['paragraphs'],
                details: $payload['details'],
                ctaLabel: $payload['ctaLabel'],
                ctaUrl: $payload['ctaUrl'],
                secondaryLabel: $payload['secondaryLabel'] ?? null,
                secondaryUrl: $payload['secondaryUrl'] ?? null,
            ));

            // log/array mailers "succeed" without delivering to an inbox
            if (! self::mailerDeliversToInbox()) {
                $mailer = (string) config('mail.default', 'log');
                BuyerRequestAlertLogRecorder::record(
                    $user,
                    $request,
                    BuyerRequestAlertLog::CHANNEL_EMAIL,
                    $key,
                    $email,
                    $subject,
                    $body,
                    BuyerRequestAlertLog::STATUS_FAILED,
                    "Email was not delivered (MAIL_MAILER={$mailer}). Configure SMTP/SES (or similar) to send real email."
                );

                return;
            }

            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_EMAIL,
                $key,
                $email,
                $subject,
                $body,
                BuyerRequestAlertLog::STATUS_SENT
            );
        } catch (\Throwable $e) {
            Log::warning('Buyer request alert email failed', [
                'user_id' => $user->id,
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_EMAIL,
                $key,
                $email,
                $subject,
                $body,
                BuyerRequestAlertLog::STATUS_FAILED,
                $e->getMessage()
            );
        }
    }

    /**
     * True when mail is expected to reach a real inbox (or Mail::fake() in tests).
     */
    protected static function mailerDeliversToInbox(): bool
    {
        if (Mail::getFacadeRoot() instanceof MailFake) {
            return true;
        }

        $mailer = strtolower((string) config('mail.default', 'log'));

        return ! in_array($mailer, ['log', 'array'], true);
    }

    protected static function sendWhatsApp(User $user, string $key, BuyerRequest $request, string $message): void
    {
        $phone = trim((string) ($user->phone ?? ''));

        if ($phone === '') {
            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_WHATSAPP,
                $key,
                null,
                null,
                $message,
                BuyerRequestAlertLog::STATUS_SKIPPED,
                'no_phone'
            );

            return;
        }

        try {
            $sent = app(MsgpkService::class)->sendWhatsApp($phone, $message);
            if (! $sent) {
                Log::warning('Buyer request alert WhatsApp failed to send', [
                    'user_id' => $user->id,
                    'phone' => $phone,
                ]);

                BuyerRequestAlertLogRecorder::record(
                    $user,
                    $request,
                    BuyerRequestAlertLog::CHANNEL_WHATSAPP,
                    $key,
                    $phone,
                    null,
                    $message,
                    BuyerRequestAlertLog::STATUS_FAILED,
                    'Msgpk send returned false'
                );

                return;
            }

            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_WHATSAPP,
                $key,
                $phone,
                null,
                $message,
                BuyerRequestAlertLog::STATUS_SENT
            );
        } catch (\Throwable $e) {
            Log::warning('Buyer request alert WhatsApp exception', [
                'user_id' => $user->id,
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);

            BuyerRequestAlertLogRecorder::record(
                $user,
                $request,
                BuyerRequestAlertLog::CHANNEL_WHATSAPP,
                $key,
                $phone,
                null,
                $message,
                BuyerRequestAlertLog::STATUS_FAILED,
                $e->getMessage()
            );
        }
    }
}
