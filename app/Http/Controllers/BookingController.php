<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Mail\InvoiceMail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::all();
        return view('bookings.index', compact('bookings'));
    }

    public function create()
    {
        return view('bookings.create');
    }

    public function store(Request $request)
    {
            $validatedData = $request->validate([

                'cargo_type' => 'required|string',
                'glass_option' => 'nullable|string',
                'glass_size' => 'nullable|string',
                'thickness' => 'nullable|string',
                'glassquantity' => 'nullable|integer',
                'glass_type' => 'nullable|string',
                'container_size' => 'nullable|string',
                'quantity' => 'nullable|integer',
                'goods_description' => 'nullable|string',
                'weight' => 'nullable|string',
                'origin_country' => 'required|string',
                'origin_city' => 'required|string',
                'destination_country' => 'required|string',
                'destination_city' => 'required|string',
                'status' => 'required|string',
            ]);

            try {
                // Create Booking
                $booking = Booking::create([
                    'user_id' => Auth::user()->id,
                    'cargo_type' => $validatedData['cargo_type'],
                    'glass_option' => $validatedData['glass_option'],
                    'glass_size' => $validatedData['glass_size'],
                    'thickness' => $validatedData['thickness'],
                    'glassquantity' => $validatedData['glassquantity'],
                    'glass_type' => $validatedData['glass_type'],
                    'container_size' => $validatedData['container_size'],
                    'quantity' => $validatedData['quantity'],
                    'goods_description' => $validatedData['goods_description'],
                    'weight' => $validatedData['weight'],
                    'origin_country' => $validatedData['origin_country'],
                    'origin_city' => $validatedData['origin_city'],
                    'destination_country' => $validatedData['destination_country'],
                    'destination_city' => $validatedData['destination_city'],
                    'status' => $validatedData['status'],
                ]);

                // Create Invoice
                $invoice = Invoice::create([
                    'user_id' => Auth::user()->id,
                    'booking_id' => $booking->id,
                    'total_cost' => $request->input('total_cost'),
                    'advance_payment' => $request->input('advance_payment'),
                    'remaining_payment' => $request->input('remaining_payment'),
                    'vat' => $request->input('vat'),
                    'final_cost' => $request->input('final_cost'),
                ]);
                $invoice->booking()->associate($booking);
                $invoice = Invoice::with('booking', 'user')->findOrFail($invoiceId);

                // Send the email
                Mail::to($invoice->user->email)->send(new InvoiceMail($invoice));
                return response()->json(['success' => true, 'message' => 'Booking saved successfully.']);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => $e]);
            }

    }

    public function show(Booking $booking)
    {
        return view('bookings.show', compact('booking'));
    }

    public function edit(Booking $booking)
    {
        return view('bookings.edit', compact('booking'));
    }

    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'cargo_type' => 'required|string',
            'details' => 'required|json',
            'origin' => 'required|string',
            'destination' => 'required|string',
            'container_count' => 'nullable|integer',
        ]);

        $booking->update($request->all());
        return redirect()->route('bookings.index')->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully.');
    }
}
