<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        // Fetch only unread notifications for the specific user
        $notifications = Notification::where('not_user_id', $userId)
                                      ->whereNull('read_at')
                                      ->paginate(10);
        
        return NotificationResource::collection($notifications);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreNotificationRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreNotificationRequest $request)
    {
        $notification = Notification::create($request->validated());
        return response()->json(['data' => new NotificationResource($notification)], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function show(Notification $notification)
    {
        return response()->json(['data' => new NotificationResource($notification)], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateNotificationRequest  $request
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $notification->update([
            'read_at' => now(), // Update the read_at attribute to the current timestamp
        ]);

        return response()->json(['data' => new NotificationResource($notification)], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json([], 204);
    }
    public function markAllAsRead(Request $request)
    {
        $notificationIds = $request->input('notificationIds', []);
    
        Log::channel('single')->info('markAllAsRead method');
        Log::debug('Notification IDs to mark as read: ' . json_encode($notificationIds));
    
        // Iterate over each notification ID and update them individually
        foreach ($notificationIds as $notificationId) {
            Log::channel('single')->info('Processing notification ID: ' . $notificationId);
    
            $notification = Notification::find($notificationId);
    
            if ($notification) {
                $notification->update(['read_at' => now()]);
                Log::channel('single')->info('Notification marked as read: ' . $notificationId);
            } else {
                Log::channel('single')->warning('Notification not found: ' . $notificationId);
            }
        }
    
        return response()->json(['message' => 'All notifications marked as read'], 200);
    }
    
}
