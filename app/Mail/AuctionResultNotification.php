<?php

namespace App\Mail;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionResultNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Listing $listing;
    public string $audience;
    public string $result;
    public ?float $winningBid;

    /**
     * @param string $audience winner|loser|seller
     * @param string $result awarded|closed
     */
    public function __construct(Listing $listing, string $audience, string $result = 'awarded', ?float $winningBid = null)
    {
        $this->listing = $listing;
        $this->audience = $audience;
        $this->result = $result;
        $this->winningBid = $winningBid;
    }

    public function build()
    {
        $emailData = $this->resolveEmailData();

        return $this
            ->subject($emailData['subject'])
            ->view('emails.auction_result_notification')
            ->with([
                'subjectLine' => $emailData['subject'],
                'heading' => $emailData['heading'],
                'bodyMessage' => $emailData['message'],
                'listing' => $this->listing,
                'winningBid' => $this->winningBid,
                'result' => $this->result,
                'audience' => $this->audience,
            ]);
    }

    private function resolveEmailData(): array
    {
        $title = $this->listing->title ?? 'Auction';
        $subject = 'Auction Update - XpertBid';
        $heading = 'Auction Update';
        $message = 'There is an update about "' . $title . '".';

        if ($this->result === 'closed' && $this->audience === 'seller') {
            return [
                'subject' => 'Auction Closed - No Bids',
                'heading' => 'Your Auction Has Closed',
                'message' => 'Your auction "' . $title . '" ended without any valid bids.',
            ];
        }

        if ($this->audience === 'winner') {
            $amountText = $this->winningBid !== null
                ? ' Winning bid: ' . number_format((float) $this->winningBid, 2) . '.'
                : '';

            return [
                'subject' => 'Congratulations! You Won the Auction',
                'heading' => 'You Won the Auction',
                'message' => 'You won "' . $title . '".' . $amountText,
            ];
        }

        if ($this->audience === 'loser') {
            return [
                'subject' => 'Auction Result - Better Luck Next Time',
                'heading' => 'Auction Result',
                'message' => 'You did not win "' . $title . '". Keep bidding on other listings.',
            ];
        }

        if ($this->audience === 'seller') {
            $amountText = $this->winningBid !== null
                ? ' Winning bid: ' . number_format((float) $this->winningBid, 2) . '.'
                : '';

            return [
                'subject' => 'Your Auction Has a Winner',
                'heading' => 'Your Auction Has a Winner',
                'message' => 'Your auction "' . $title . '" has been awarded to the highest bidder.' . $amountText,
            ];
        }

        return [
            'subject' => $subject,
            'heading' => $heading,
            'message' => $message,
        ];
    }
}
