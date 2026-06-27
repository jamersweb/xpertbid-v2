<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PayFastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PayFastController extends Controller
{
    public function redirect(Request $request, string $orderNumber, PayFastService $payFast)
    {
        $order = $this->findPayFastOrder($request, $orderNumber);

        if (! $order) {
            return $this->notFoundResponse($request);
        }

        if ($order->payment_status === 'paid') {
            if ($this->wantsJson($request)) {
                return response()->json([
                    'success' => true,
                    'order_number' => $order->order_number,
                    'payment_status' => $order->payment_status,
                    'message' => 'Order is already paid.',
                ]);
            }

            return redirect()->route('orders.show', $order->order_number);
        }

        try {
            if ($this->wantsJson($request)) {
                return $this->payFastJsonResponse($order, $payFast);
            }

            return view('payfast.redirect', [
                'postUrl' => $payFast->postUrl(),
                'fields' => $payFast->checkoutFields($order),
                'order' => $order,
            ]);
        } catch (Throwable $e) {
            Log::error('Unable to prepare PayFast redirect', [
                'order_number' => $order->order_number,
                'message' => $e->getMessage(),
            ]);

            if ($this->wantsJson($request)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to start PayFast payment. Please try again.',
                ], 502);
            }

            return redirect()
                ->route('orders.show', $order->order_number)
                ->with('error', 'Unable to start PayFast payment. Please try again.');
        }
    }

    public function startJson(Request $request, string $orderNumber, PayFastService $payFast)
    {
        $order = $this->findPayFastOrder($request, $orderNumber);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'PayFast order not found.',
            ], 404);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => true,
                'order_number' => $order->order_number,
                'payment_status' => $order->payment_status,
                'message' => 'Order is already paid.',
            ]);
        }

        try {
            return $this->payFastJsonResponse($order, $payFast);
        } catch (Throwable $e) {
            Log::error('Unable to prepare PayFast mobile checkout', [
                'order_number' => $order->order_number,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to start PayFast payment. Please try again.',
            ], 502);
        }
    }

    public function notify(Request $request, PayFastService $payFast)
    {
        $payload = $request->all();
        $orderNumber = $payFast->orderReference($payload);

        Log::info('PayFast notify received', [
            'order_number' => $orderNumber,
            'payload' => $payload,
        ]);

        if (! $orderNumber) {
            return response('Missing order reference', 400);
        }

        $order = Order::where('order_number', $orderNumber)
            ->where('payment_method', 'payfast')
            ->first();

        if (! $order) {
            return response('Order not found', 404);
        }

        if (! $payFast->amountMatches($order, $payload)) {
            Log::warning('PayFast notify amount mismatch', [
                'order_number' => $order->order_number,
                'order_total' => $order->total,
                'payload' => $payload,
            ]);

            return response('Amount mismatch', 400);
        }

        if (! $payFast->callbackSignatureMatches($order, $payload)) {
            Log::warning('PayFast notify signature mismatch', [
                'order_number' => $order->order_number,
            ]);

            return response('Invalid signature', 400);
        }

        if ($order->payment_status === 'paid') {
            return response('OK', 200);
        }

        $transactionId = $payFast->transactionId($payload);

        if ($payFast->isSuccessful($payload)) {
            $order->forceFill([
                'payment_status' => 'paid',
                'status' => 'processing',
                'transaction_id' => $transactionId ?: $order->transaction_id,
            ])->save();
        } else {
            $order->forceFill([
                'payment_status' => 'failed',
                'status' => 'cancelled',
                'transaction_id' => $transactionId ?: $order->transaction_id,
            ])->save();
        }

        return response('OK', 200);
    }

    public function success(Request $request, string $orderNumber)
    {
        $order = $this->findPayFastOrder($request, $orderNumber);

        if (! $order) {
            return $this->notFoundResponse($request);
        }

        if ($this->wantsJson($request)) {
            return response()->json([
                'success' => true,
                'order_number' => $order->order_number,
                'payment_status' => $order->payment_status,
                'message' => 'PayFast payment received. Confirmation may take a few moments.',
            ]);
        }

        return redirect()
            ->route('orders.show', $order->order_number)
            ->with('success', 'PayFast payment received. Confirmation may take a few moments.');
    }

    public function failure(Request $request, string $orderNumber)
    {
        $order = $this->findPayFastOrder($request, $orderNumber);

        if (! $order) {
            return $this->notFoundResponse($request);
        }

        if ($order->payment_status === 'pending') {
            $order->forceFill([
                'payment_status' => 'failed',
                'status' => 'cancelled',
            ])->save();
        }

        if ($this->wantsJson($request)) {
            return response()->json([
                'success' => false,
                'order_number' => $order->order_number,
                'payment_status' => $order->payment_status,
                'message' => 'PayFast payment was not completed.',
            ]);
        }

        return redirect()
            ->route('orders.show', $order->order_number)
            ->with('error', 'PayFast payment was not completed.');
    }

    private function findPayFastOrder(Request $request, string $orderNumber): ?Order
    {
        $query = Order::where('order_number', $orderNumber)
            ->where('payment_method', 'payfast');

        if ($request->user()) {
            $query->where('user_id', $request->user()->id);
        }

        return $query->first();
    }

    private function payFastJsonResponse(Order $order, PayFastService $payFast)
    {
        return response()->json([
            'success' => true,
            'order_number' => $order->order_number,
            'payment_status' => $order->payment_status,
            'payment' => [
                'provider' => 'payfast',
                'method' => 'hosted_form',
                'post_url' => $payFast->postUrl(),
                'fields' => $payFast->checkoutFields($order),
                'redirect_url' => route('payfast.redirect', $order->order_number),
                'success_url' => route('payfast.success', $order->order_number),
                'failure_url' => route('payfast.failure', $order->order_number),
            ],
        ]);
    }

    private function wantsJson(Request $request): bool
    {
        return $request->wantsJson() || $request->expectsJson();
    }

    private function notFoundResponse(Request $request)
    {
        if ($this->wantsJson($request)) {
            return response()->json([
                'success' => false,
                'message' => 'PayFast order not found.',
            ], 404);
        }

        abort(404);
    }
}
