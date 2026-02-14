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
        Schema::table('carts', function (Blueprint $table) {
            // Add type column after auction_id
            $table->string('type')->default('product')->after('auction_id');
            
            // Drop old unique constraint
            $table->dropUnique(['user_id', 'auction_id']);
            
            // Add new unique constraint including type
            $table->unique(['user_id', 'auction_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'auction_id', 'type']);
            $table->unique(['user_id', 'auction_id']);
            $table->dropColumn('type');
        });
    }
};
