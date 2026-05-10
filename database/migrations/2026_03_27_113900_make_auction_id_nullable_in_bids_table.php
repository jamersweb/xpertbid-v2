<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('bids', function (Blueprint $table) {
                $table->unsignedBigInteger('auction_id')->nullable()->change();
            });
            return;
        }

        DB::statement('ALTER TABLE bids MODIFY auction_id BIGINT UNSIGNED NULL');
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement('UPDATE bids SET auction_id = 1 WHERE auction_id IS NULL');
        DB::statement('ALTER TABLE bids MODIFY auction_id BIGINT UNSIGNED NOT NULL');
    }
};
