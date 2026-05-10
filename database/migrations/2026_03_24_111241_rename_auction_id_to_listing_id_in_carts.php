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
        if (!Schema::hasTable('carts') || !Schema::hasColumn('carts', 'auction_id')) {
            return;
        }

        Schema::table('carts', function (Blueprint $table) {
            $table->renameColumn('auction_id', 'listing_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('carts') || !Schema::hasColumn('carts', 'listing_id')) {
            return;
        }

        Schema::table('carts', function (Blueprint $table) {
            $table->renameColumn('listing_id', 'auction_id');
        });
    }
};
