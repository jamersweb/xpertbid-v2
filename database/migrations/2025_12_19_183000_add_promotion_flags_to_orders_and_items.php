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
              Schema::table('orders', function (Blueprint $table) {
                     $table->boolean('is_promotion')->default(false)->after('order_number');
              });

              Schema::table('order_items', function (Blueprint $table) {
                     $table->string('type')->default('product')->after('auction_id');
              });
       }

       /**
        * Reverse the migrations.
        */
       public function down(): void
       {
              Schema::table('orders', function (Blueprint $table) {
                     $table->dropColumn('is_promotion');
              });

              Schema::table('order_items', function (Blueprint $table) {
                     $table->dropColumn('type');
              });
       }
};
