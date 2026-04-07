<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            if (! Schema::hasColumn('listings', 'listing_source')) {
                $table->string('listing_source')->nullable()->after('listing_type');
            }
        });

        Schema::table('bids', function (Blueprint $table) {
            if (! Schema::hasColumn('bids', 'bid_source')) {
                $table->string('bid_source')->nullable()->after('bid_amount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            if (Schema::hasColumn('listings', 'listing_source')) {
                $table->dropColumn('listing_source');
            }
        });

        Schema::table('bids', function (Blueprint $table) {
            if (Schema::hasColumn('bids', 'bid_source')) {
                $table->dropColumn('bid_source');
            }
        });
    }
};
