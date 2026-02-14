<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentRequest;
use Illuminate\Support\Facades\Auth;

class PaymentRequestController extends Controller
{
    // Store a Payment Request
    public function store(Request $request)
    {
       $request->validate(
    ['amount' => 'required|numeric|min:50'],
    [
        'amount.required' => 'Please enter an amount.',
        'amount.numeric'  => 'Amount must be a valid number.',
        'amount.min'      => 'Please enter an amount of at least $50 USD.',
    ]
);


        $paymentRequest = PaymentRequest::create([
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'status' => 'pending', // Default status
        ]);

        return response()->json(['message' => 'Payment request sent successfully', 'data' => $paymentRequest], 201);
    }
    public function Adminindex()
    {
        $requests = PaymentRequest::with(['user', 'paymentMethod'])
                       ->orderBy('created_at', 'desc')
                       ->paginate(10);
        return view('payment_requests.index', compact('requests'));
    }
    // fetch Payment Requests for a User
    public function index()
    {
        $requests = PaymentRequest::where('user_id', Auth::id())
                ->with('paymentMethod') 
                ->orderBy('created_at', 'desc')
                ->paginate(15);

        return \Inertia\Inertia::render('PaymentRequests/Index', [
            'requests' => $requests
        ]);
    }
    public function update(Request $request, PaymentRequest $paymentRequest)
    {
        // Validate only the status
        $data = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Update & save
        $paymentRequest->status = $data['status'];
        $paymentRequest->save();

        // Return JSON for your AJAX
        return response()->json([
            'message' => 'Status updated successfully.',
            'status'  => $paymentRequest->status,
        ]);
    }
    // admin: Update Payment Request Status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed',
        ]);

        $paymentRequest = PaymentRequest::findOrFail($id);
        $paymentRequest->status = $request->status;
        $paymentRequest->save();

        return response()->json(['message' => 'Payment request updated successfully']);
    }
}
