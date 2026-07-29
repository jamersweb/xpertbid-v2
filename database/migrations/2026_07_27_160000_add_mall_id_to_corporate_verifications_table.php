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
        Schema::table('corporate_verifications', function (Blueprint $table) {
            $table->foreignId('mall_id')
                ->nullable()
                ->after('country')
                ->constrained('malls')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('corporate_verifications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('mall_id');
        });
    }
};
