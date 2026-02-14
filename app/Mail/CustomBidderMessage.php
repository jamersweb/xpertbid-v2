<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomBidderMessage extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectLine;
    public $content;

    public function __construct($subject, $content)
    {
        $this->subjectLine = $subject;
        $this->content = $content;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
                    ->html($this->content);
    }
}
