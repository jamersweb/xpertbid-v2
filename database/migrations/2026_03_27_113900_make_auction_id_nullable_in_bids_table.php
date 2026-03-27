<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE bids MODIFY auction_id BIGINT UNSIGNED NULL');
    }

    public function down(): void
    {
        DB::statement('UPDATE bids SET auction_id = 1 WHERE auction_id IS NULL');
        DB::statement('ALTER TABLE bids MODIFY auction_id BIGINT UNSIGNED NOT NULL');
    }
};
