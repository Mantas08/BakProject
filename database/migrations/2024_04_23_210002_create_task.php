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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('description', 255);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('relevance', ['Labai svarbi', 'svarbi', 'Nesvarbi']);
            $table->enum('status', ['Atlikta', 'Sustabdyta', 'Atidėta', 'Atšaukta', 'Vykdoma']);
            $table->string('image_url')->nullable();
            $table->unsignedBigInteger('property_id_task');
            $table->unsignedBigInteger('user_id_task')->nullable();

            $table->foreign('property_id_task')->references('id')->on('properties');
            $table->foreign('user_id_task')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
