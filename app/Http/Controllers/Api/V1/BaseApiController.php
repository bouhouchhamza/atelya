<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseApiController extends Controller
{
    protected function success(mixed $data, string $message = 'OK', int $status = 200): JsonResponse
    {
        if ($data instanceof JsonResource || $data instanceof ResourceCollection) {
            $data = $data->resolve();
            if (is_array($data) && array_key_exists('data', $data) && count($data) === 1) {
                $data = $data['data'];
            }
        }

        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function paginated(
        LengthAwarePaginator $paginator,
        ResourceCollection|JsonResource $resource,
        string $message = 'OK'
    ): JsonResponse {
        $resolved = $resource->resolve();
        $resolvedData = is_array($resolved) && array_key_exists('data', $resolved)
            ? $resolved['data']
            : $resolved;

        return response()->json([
            'message' => $message,
            'data' => $resolvedData,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
