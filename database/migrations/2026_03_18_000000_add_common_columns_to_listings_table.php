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
            $table->string('slug')->unique()->nullable()->after('title');
            $table->string('image')->nullable()->after('slug');
            $table->json('album')->nullable()->after('image');
            $table->string('featured_name')->nullable()->after('status');
            $table->boolean('is_1_rupee')->default(false)->after('featured_name');
            $table->integer('views')->default(0)->after('is_1_rupee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['slug', 'image', 'album', 'featured_name', 'is_1_rupee', 'views']);
        });
    }
};
