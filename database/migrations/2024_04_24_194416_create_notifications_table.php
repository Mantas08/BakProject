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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->unsignedBigInteger('not_user_id');
            $table->unsignedBigInteger('not_property_id')->nullable();
            $table->unsignedBigInteger('not_task_id')->nullable();
            $table->unsignedBigInteger('not_reservation_id')->nullable();
            $table->timestamps();
            
            // Define foreign key constraints
            $table->foreign('not_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('not_property_id')->references('id')->on('properties')->onDelete('set null');
            $table->foreign('not_reservation_id')->references('id')->on('reservations')->onDelete('set null');
            $table->foreign('not_task_id')->references('id')->on('tasks')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
