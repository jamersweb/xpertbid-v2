<?php

namespace App\Console\Commands;

use App\Jobs\SyncCurrencyRatesJob;
use Illuminate\Console\Command;
use Throwable;

class SyncCurrencyRates extends Command
{
    protected $signature = 'currency:sync-rates';

    protected $description = 'Fetch latest currency rates and update enabled currencies.';

    public function handle(SyncCurrencyRatesJob $job): int
    {
        try {
            $result = $job->handle();

            $this->info('Currency rates synced successfully.');
            $this->line('Updated: ' . ($result['updated'] ?? 0));

            if (!empty($result['skipped'])) {
                $this->warn('Skipped: ' . implode(', ', $result['skipped']));
            }

            if (!empty($result['next_update'])) {
                $this->line('Next provider update: ' . $result['next_update']);
            }

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Currency sync failed: ' . $e->getMessage());
            report($e);

            return self::FAILURE;
        }
    }
}
