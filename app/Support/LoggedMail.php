<?php

namespace App\Support;

class LoggedMail
{
    public static function to(array|string $recipients): PendingLoggedMail
    {
        return new PendingLoggedMail($recipients);
    }
}
