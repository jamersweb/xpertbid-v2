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
        if (
            !Schema::hasTable('favorites') ||
            !Schema::hasColumn('favorites', 'auctions_id') ||
            Schema::getConnection()->getDriverName() === 'sqlite'
        ) {
            return;
        }

        Schema::table('favorites', function (Blueprint $table) {
            $table->unsignedBigInteger('auctions_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (
            !Schema::hasTable('favorites') ||
            !Schema::hasColumn('favorites', 'auctions_id') ||
            Schema::getConnection()->getDriverName() === 'sqlite'
        ) {
            return;
        }

        Schema::table('favorites', function (Blueprint $table) {
            $table->unsignedBigInteger('auctions_id')->nullable(false)->change();
        });
    }
};
