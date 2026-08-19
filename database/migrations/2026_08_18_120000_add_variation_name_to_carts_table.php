<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('carts') || Schema::hasColumn('carts', 'variation_name')) {
            return;
        }

        Schema::table('carts', function (Blueprint $table) {
            $table->string('variation_name')->nullable()->after('variation_id');
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('carts') || !Schema::hasColumn('carts', 'variation_name')) {
            return;
        }

        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn('variation_name');
        });
    }
};
