<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            if (!Schema::hasColumn('auctions', 'discount_type')) {
                $table->string('discount_type')->nullable()->after('minimum_bid'); // percent, flat
            }
            if (!Schema::hasColumn('auctions', 'discount_value')) {
                $table->decimal('discount_value', 10, 2)->nullable()->after('discount_type');
            }
        });

        Schema::table('product_variations', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variations', 'discount_type')) {
                $table->string('discount_type')->nullable()->after('price'); // percent, flat
            }
            if (!Schema::hasColumn('product_variations', 'discount_value')) {
                $table->decimal('discount_value', 10, 2)->nullable()->after('discount_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value']);
        });

        Schema::table('product_variations', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value']);
        });
    }
};
