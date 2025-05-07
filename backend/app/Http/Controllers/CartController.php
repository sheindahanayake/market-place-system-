<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index()
    {
        if (!auth()->user()->isUser()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = auth()->user()->cart()->with('items.product')->firstOrCreate();
        return response()->json(['cart' => $cart, 'total' => $cart->total]);
    }

    public function addItem(Request $request)
    {
        if (!auth()->user()->isUser()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::find($request->product_id);

        // Check stock availability
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available'], 422);
        }

        // Ensure the user has a cart
        $cart = auth()->user()->cart()->firstOrCreate();

        // Check if item already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;

            // Ensure the updated quantity does not exceed stock
            if ($cartItem->quantity > $product->stock) {
                return response()->json(['message' => 'Not enough stock available'], 422);
            }

            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        $cart = $cart->fresh()->load('items.product');
        return response()->json(['cart' => $cart, 'total' => $cart->total, 'message' => 'Product added to cart successfully']);
    }

    public function updateItem(Request $request, CartItem $item)
    {
        if (!auth()->user()->isUser() || $item->cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = $item->product;

        // Check stock availability
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available'], 422);
        }

        $item->quantity = $request->quantity;
        $item->save();

        $cart = auth()->user()->cart->load('items.product');
        return response()->json(['cart' => $cart, 'total' => $cart->total, 'message' => 'Cart item updated successfully']);
    }

    public function removeItem(CartItem $item)
    {
        if (!auth()->user()->isUser() || $item->cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();

        $cart = auth()->user()->cart->load('items.product');
        return response()->json(['cart' => $cart, 'total' => $cart->total, 'message' => 'Cart item removed successfully']);
    }

    public function clearCart()
    {
        if (!auth()->user()->isUser()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = auth()->user()->cart()->firstOrCreate();
        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }

    public function clearCartBySupplier(Request $request)
    {
        if (!auth()->user()->isSupplier()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        $cart = $user->cart()->firstOrCreate();

        // Only remove items from this supplier
        CartItem::whereHas('product', function ($query) {
            $query->where('supplier_id', auth()->id());
        })->where('cart_id', $cart->id)->delete();

        return response()->json(['message' => 'Cart items cleared successfully']);
    }
}