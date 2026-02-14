<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BuyNowInquiry;
use App\Mail\BuyNowInquiryMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BuyNowInquiryController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string|max:1000',
            'auction_id' => 'required|integer',
            'auction_title' => 'required|string|max:255',
            'user_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $inquiry = BuyNowInquiry::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => $request->message,
                'auction_id' => $request->auction_id,
                'auction_title' => $request->auction_title,
                'user_id' => $request->user_id,
                'status' => 'pending',
            ]);

            // Send email to admin
            try {
                $adminEmail = env('ADMIN_EMAIL');
                Mail::to($adminEmail)->send(new BuyNowInquiryMail($inquiry));
            } catch (\Exception $e) {
                Log::error('Email send failed: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your inquiry! We will contact you shortly.',
                'inquiry_id' => $inquiry->id
            ], 200);

        } catch (\Exception $e) {
            Log::error('Buy Now Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit inquiry.'
            ], 500);
        }
    }
}