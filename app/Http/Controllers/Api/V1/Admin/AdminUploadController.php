<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminUploadController extends BaseApiController
{
    public function storeProductImage(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $path = $validated['image']->store('products', 'public');

        return $this->success([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 'Product image uploaded successfully.', 201);
    }
}
