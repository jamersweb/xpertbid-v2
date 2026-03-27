<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('buy_now_inquiries', function (Blueprint $table) {
            $table->renameColumn('auction_id', 'listing_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buy_now_inquiries', function (Blueprint $table) {
            $table->renameColumn('listing_id', 'auction_id');
        });
    }
};
