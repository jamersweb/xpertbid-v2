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
        Schema::create('categories', function (Blueprint $col) {
            $col->id();
            $col->string('name');
            $col->string('slug')->unique();
            $col->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
            $col->string('image')->nullable();
            $col->text('description')->nullable();
            $col->boolean('status')->default(true);
            $col->timestamps();
            $col->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
