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
        if (!Schema::hasColumn('carts', 'variation_id')) {
            Schema::table('carts', function (Blueprint $table) {
                $table->foreignId('variation_id')->nullable()->after('auction_id')->constrained('product_variations')->onDelete('cascade');
            });
        }

        try {
            Schema::table('carts', function (Blueprint $table) {
                // Try to drop the unique index by array syntax (Laravel guesses name)
                $table->dropUnique(['user_id', 'auction_id']);
            });
        } catch (\Exception $e) {
            // If dropping by array failed, try dropping by explicit name just in case
            try {
                Schema::table('carts', function (Blueprint $table) {
                    $table->dropUnique('carts_user_id_auction_id_unique');
                });
            } catch (\Exception $e) {
                // If index doesn't exist, we can ignore and proceed
            }
        }

        try {
            Schema::table('carts', function (Blueprint $table) {
                $table->unique(['user_id', 'auction_id', 'variation_id']);
            });
        } catch (\Exception $e) {
            // Index might already exist if we are re-running
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['variation_id']);
            $table->dropUnique(['user_id', 'auction_id', 'variation_id']);
            $table->dropColumn('variation_id');

            // Restore old unique constraint
            try {
                $table->unique(['user_id', 'auction_id']);
            } catch (\Exception $e) {
            }
        });
    }
};
