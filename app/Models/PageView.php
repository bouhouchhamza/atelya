<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'path',
        'referrer',
        'user_agent',
        'device',
        'ip_hash',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
