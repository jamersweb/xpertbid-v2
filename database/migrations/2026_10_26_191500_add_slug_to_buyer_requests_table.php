<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('buyer_requests', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
        });

        $rows = DB::table('buyer_requests')->select('id', 'title')->orderBy('id')->get();
        foreach ($rows as $row) {
            $base = Str::slug($row->title ?: 'request') ?: 'request';
            $slug = $base;
            $i = 1;
            while (
                DB::table('buyer_requests')
                    ->where('slug', $slug)
                    ->where('id', '!=', $row->id)
                    ->exists()
            ) {
                $slug = $base.'-'.$i;
                $i++;
            }
            DB::table('buyer_requests')->where('id', $row->id)->update(['slug' => $slug]);
        }
    }

    public function down(): void
    {
        Schema::table('buyer_requests', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
