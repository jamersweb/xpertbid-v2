<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('conversations') || !Schema::hasColumn('conversations', 'product_id')) {
            return;
        }

        $database = DB::getDatabaseName();
        $foreignKey = DB::table('information_schema.KEY_COLUMN_USAGE')
            ->where('TABLE_SCHEMA', $database)
            ->where('TABLE_NAME', 'conversations')
            ->where('COLUMN_NAME', 'product_id')
            ->whereNotNull('REFERENCED_TABLE_NAME')
            ->value('CONSTRAINT_NAME');

        if ($foreignKey) {
            DB::statement(sprintf('ALTER TABLE `conversations` DROP FOREIGN KEY `%s`', $foreignKey));
        }

        DB::table('conversations')
            ->whereNotNull('product_id')
            ->whereNotIn('product_id', function ($query) {
                $query->select('id')->from('listings');
            })
            ->update(['product_id' => null]);

        Schema::table('conversations', function (Blueprint $table) {
            $table->foreign('product_id')
                ->references('id')
                ->on('listings')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('conversations') || !Schema::hasColumn('conversations', 'product_id')) {
            return;
        }

        $database = DB::getDatabaseName();
        $foreignKey = DB::table('information_schema.KEY_COLUMN_USAGE')
            ->where('TABLE_SCHEMA', $database)
            ->where('TABLE_NAME', 'conversations')
            ->where('COLUMN_NAME', 'product_id')
            ->whereNotNull('REFERENCED_TABLE_NAME')
            ->value('CONSTRAINT_NAME');

        if ($foreignKey) {
            DB::statement(sprintf('ALTER TABLE `conversations` DROP FOREIGN KEY `%s`', $foreignKey));
        }
    }
};
