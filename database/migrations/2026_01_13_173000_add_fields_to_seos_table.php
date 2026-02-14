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
        Schema::table('seos', function (Blueprint $table) {
            $table->text('schema_markup')->nullable()->after('meta_keywords');
            $table->string('canonical_url')->nullable()->after('schema_markup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seos', function (Blueprint $table) {
            $table->dropColumn(['schema_markup', 'canonical_url']);
        });
    }
};
