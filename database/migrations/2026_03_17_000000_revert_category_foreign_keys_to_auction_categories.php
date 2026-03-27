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
         Schema::table('listings', function (Blueprint $table) {
             // Drop old foreign key and column
             $table->dropForeign(['category_id']);
             $table->dropColumn('category_id');
             
             // Add new 3-level categories pointing to auction_categories
             $table->unsignedBigInteger('category_id')->after('user_id');
             $table->foreign('category_id')->references('id')->on('auction_categories')->onDelete('cascade');
             
             $table->unsignedBigInteger('sub_category_id')->nullable()->after('category_id');
             $table->foreign('sub_category_id')->references('id')->on('auction_categories')->onDelete('set null');
             
             $table->unsignedBigInteger('child_category_id')->nullable()->after('sub_category_id');
             $table->foreign('child_category_id')->references('id')->on('auction_categories')->onDelete('set null');
         });
 
         Schema::table('dynamic_fields', function (Blueprint $table) {
             // Drop old link to 'categories'
             $table->dropForeign(['category_id']);
             $table->dropColumn('category_id');
             
             // Point to 'auction_categories'
             $table->unsignedBigInteger('category_id')->nullable()->after('listing_type');
             $table->foreign('category_id')->references('id')->on('auction_categories')->onDelete('cascade');
         });
     }
 
     /**
      * Reverse the migrations.
      */
     public function down(): void
     {
         Schema::table('listings', function (Blueprint $table) {
             $table->dropForeign(['category_id']);
             $table->dropForeign(['sub_category_id']);
             $table->dropForeign(['child_category_id']);
             $table->dropColumn(['category_id', 'sub_category_id', 'child_category_id']);
             
             $table->foreignId('category_id')->after('user_id')->constrained('categories')->onDelete('cascade');
         });
 
         Schema::table('dynamic_fields', function (Blueprint $table) {
             $table->dropForeign(['category_id']);
             $table->dropColumn('category_id');
             $table->foreignId('category_id')->nullable()->after('listing_type')->constrained('categories')->onDelete('cascade');
         });
     }
 };
