<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSeoFieldsToAuctionCategoriesTable extends Migration
{
       /**
        * Run the migrations.
        *
        * @return void
        */
       public function up()
       {
              Schema::table('auction_categories', function (Blueprint $table) {
                     $table->string('meta_title')->nullable()->after('image');
                     $table->text('meta_description')->nullable()->after('meta_title');
                     $table->longText('seo_content')->nullable()->after('meta_description');
                     $table->longText('schema_markup')->nullable()->after('seo_content');
              });
       }

       /**
        * Reverse the migrations.
        *
        * @return void
        */
       public function down()
       {
              Schema::table('auction_categories', function (Blueprint $table) {
                     $table->dropColumn(['meta_title', 'meta_description', 'seo_content', 'schema_markup']);
              });
       }
}
