<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            $orders = Order::with('user', 'items.product.supplier')->get();
        } elseif ($user->isSupplier()) {
            $orders = Order::with('user', 'items.product')
                ->whereHas('items.product', function ($query) {
                    $query->where('supplier_id', auth()->id());
                })
                ->get();
        } else {
            $orders = Order::with('items.product')->where('user_id', auth()->id())->get();
        }

        return response()->json(['orders' => $orders]);
    }

    public function show(Order $order)
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            // Admin can view any order
        } elseif ($user->isSupplier()) {
            // Supplier can only view orders that contain their products
            $hasSupplierProducts = $order->items()->whereHas('product', function ($query) {
                $query->where('supplier_id', auth()->id());
            })->exists();

            if (!$hasSupplierProducts) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($order->user_id !== auth()->id()) {
            // Regular users can only view their own orders
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['order' => $order->load('items.product', 'user')]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isUser()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = auth()->user()->cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        // Check stock availability
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Not enough stock for {$item->product->name}",
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'total_amount' => $cart->items->sum(function ($item) {
                    return $item->quantity * $item->product->price;
                }),
                'status' => 'pending',
            ]);

            // Create order items and update stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);

                // Update product stock
                $product = $item->product;
                $product->stock -= $item->quantity;
                $product->save();
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order: ' . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $user = auth()->user();

        if (!$user->isAdmin() && !$user->isSupplier()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->isSupplier()) {
            // Supplier can only update orders containing their products
            $hasSupplierProducts = $order->items()->whereHas('product', function ($query) {
                $query->where('supplier_id', auth()->id());
            })->exists();

            if (!$hasSupplierProducts) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->fresh(),
        ]);
    }
}