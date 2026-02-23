<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Analytics\StoreEventRequest;
use App\Http\Requests\Api\V1\Analytics\StorePageViewRequest;
use App\Models\Event;
use App\Models\PageView;

class AnalyticsController extends BaseApiController
{
    public function storePageView(StorePageViewRequest $request)
    {
        $data = $request->validated();

        PageView::query()->create([
            'session_id' => $data['session_id'],
            'user_id' => $request->user()?->id,
            'path' => $data['path'],
            'referrer' => $data['referrer'] ?? null,
            'user_agent' => (string) $request->userAgent(),
            'device' => $data['device'] ?? null,
            'ip' => (string) $request->ip(),
            'ip_hash' => $request->ip() ? hash('sha256', (string) $request->ip()) : null,
        ]);

        return $this->success(null, 'Page view tracked.', 201);
    }

    public function storeEvent(StoreEventRequest $request)
    {
        $data = $request->validated();

        Event::query()->create([
            'type' => $data['type'],
            'payload' => $data['payload'] ?? null,
            'session_id' => $data['session_id'],
        ]);

        return $this->success(null, 'Event tracked.', 201);
    }
}
