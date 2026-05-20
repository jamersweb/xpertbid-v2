<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('listings', 'is_1_rupee')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->boolean('is_1_rupee')->default(false)->after('featured_name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('listings', 'is_1_rupee')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->dropColumn('is_1_rupee');
            });
        }
    }
};

