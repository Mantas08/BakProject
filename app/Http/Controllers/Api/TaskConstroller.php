<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Carbon\Carbon;

class TaskConstroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with(['property'])->orderBy('id', 'desc')->paginate(10);

        // Return the paginated tasks as a collection of TaskResource
        return TaskResource::collection($tasks);
    }
    public function getByPropertyId($propertyId)
    {
        $tasks = Task::where('property_id_task', $propertyId)->with('property')->orderBy('id', 'desc')->paginate(10);

        // Return the paginated tasks as a collection of TaskResource
        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validatedData = $request->validated();

        // Parse and format the datetime strings using Carbon
        $start_date = Carbon::parse($validatedData['start_date'])->toDateString();
        $end_date = Carbon::parse($validatedData['end_date'])->toDateString();

        // Create the task record with properly formatted datetime values
        $task = Task::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'start_date' => $start_date,
            'end_date' => $end_date,
            'relevance' => $validatedData['relevance'],
            'status' => $validatedData['status'],
            'property_id_task' => $validatedData['property_id_task'],
            'user_id_task' => $validatedData['user_id_task'] ?? null, // Make user_id_task optional
        ]);

        return response(new TaskResource($task), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();

        // Parse and format the datetime strings using Carbon
        $start_date = Carbon::parse($data['start_date'])->toDateString();
        $end_date = Carbon::parse($data['end_date'])->toDateString();

        // Update the task record with properly formatted datetime values
        $task->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'start_date' => $start_date,
            'end_date' => $end_date,
            'relevance' => $data['relevance'],
            'status' => $data['status'],
            'property_id_task' => $data['property_id_task'],
            'user_id_task' => $data['user_id_task'] ?? null, // Make user_id_task optional
        ]);

        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response("", 204);
    }
}
