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
        if (!Schema::hasTable('orders') || Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->string('billing_postal_code')->nullable()->change();
            $table->string('shipping_postal_code')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('orders') || Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->string('billing_postal_code')->nullable(false)->change();
            $table->string('shipping_postal_code')->nullable(false)->change();
        });
    }
};
