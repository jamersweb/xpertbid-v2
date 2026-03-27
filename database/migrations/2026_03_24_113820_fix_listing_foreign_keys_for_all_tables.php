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
        $this->fixTable('order_items', 'order_items_auction_id_foreign');
        $this->fixTable('carts', 'carts_auction_id_foreign');
        $this->fixTable('vehicle_verifications', 'vehicle_verifications_auction_id_foreign');
        $this->fixTable('property_verifications', 'property_verifications_auction_id_foreign');
    }

    protected function fixTable($tableName, $foreignKeyName)
    {
        // 1. Drop FK if exists
        $exists = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = ? 
              AND CONSTRAINT_NAME = ? 
              AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        ", [$tableName, $foreignKeyName]);

        if (!empty($exists)) {
            Schema::table($tableName, function (Blueprint $table) use ($foreignKeyName) {
                $table->dropForeign($foreignKeyName);
            });
        }

        // 2. Make nullable & set orphaned to NULL
        Schema::table($tableName, function (Blueprint $table) {
            $table->unsignedBigInteger('listing_id')->nullable()->change();
        });

        DB::table($tableName)->whereNotExists(function($query) use ($tableName) {
            $query->select(DB::raw(1))->from('listings')->whereRaw("listings.id = {$tableName}.listing_id");
        })->update(['listing_id' => null]);

        // 3. Add new FK
        Schema::table($tableName, function (Blueprint $table) use ($tableName) {
            $onDelete = ($tableName === 'order_items') ? 'set null' : 'cascade';
            $table->foreign('listing_id')->references('id')->on('listings')->onDelete($onDelete);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
}
;
