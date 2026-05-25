<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            if (!Schema::hasColumn('brands', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
        });

        $brands = DB::table('brands')->select('id', 'name', 'slug')->orderBy('id')->get();
        $used = [];

        foreach ($brands as $brand) {
            $base = Str::slug($brand->name ?: ('brand-' . $brand->id));
            if ($base === '') {
                $base = 'brand-' . $brand->id;
            }

            $slug = $base;
            $i = 2;
            while (in_array($slug, $used, true) || DB::table('brands')->where('slug', $slug)->where('id', '!=', $brand->id)->exists()) {
                $slug = $base . '-' . $i;
                $i++;
            }

            DB::table('brands')->where('id', $brand->id)->update(['slug' => $slug]);
            $used[] = $slug;
        }

        Schema::table('brands', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            if (Schema::hasColumn('brands', 'slug')) {
                $table->dropUnique(['slug']);
                $table->dropColumn('slug');
            }
        });
    }
};
