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
        if (Schema::hasTable('vehicle_verifications') && Schema::hasColumn('vehicle_verifications', 'auction_id')) {
            Schema::table('vehicle_verifications', function (Blueprint $table) {
                $table->renameColumn('auction_id', 'listing_id');
            });
        }

        if (Schema::hasTable('property_verifications') && Schema::hasColumn('property_verifications', 'auction_id')) {
            Schema::table('property_verifications', function (Blueprint $table) {
                $table->renameColumn('auction_id', 'listing_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('vehicle_verifications') && Schema::hasColumn('vehicle_verifications', 'listing_id')) {
            Schema::table('vehicle_verifications', function (Blueprint $table) {
                $table->renameColumn('listing_id', 'auction_id');
            });
        }

        if (Schema::hasTable('property_verifications') && Schema::hasColumn('property_verifications', 'listing_id')) {
            Schema::table('property_verifications', function (Blueprint $table) {
                $table->renameColumn('listing_id', 'auction_id');
            });
        }
    }
};
