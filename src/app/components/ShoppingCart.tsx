"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ShoppingCart as CartIcon, X } from "lucide-react";
import Link from "next/link";
import type { Product } from "../api/products";

type CartItem = { product: Product; quantity: number };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default function ShoppingCart() {
  const { cartItems, isCartOpen, openCart, closeCart, removeFromCart } =
    useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subTotal = cartItems.reduce((sum, item) => {
    const price =
      item.product.discountedPrice < item.product.price
        ? item.product.discountedPrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <button
        type="button"
        onClick={openCart}
        className="flex items-center gap-2 text-white bg-transparent border-none cursor-pointer transition duration-300 hover:scale-110"
        aria-label="Open cart"
      >
        <CartIcon className="w-6" />
        <span className="text-sm font-bold">{totalItems}</span>
      </button>

      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white text-black shadow-xl z-50 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cart</h2>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-3 border-b border-gray-200 pb-4"
                  >
                    <img
                      src={item.product.image.url}
                      alt={item.product.image.alt}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.product.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Kr{" "}
                        {item.product.discountedPrice < item.product.price
                          ? item.product.discountedPrice
                          : item.product.price}{" "}
                        × {item.quantity}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 text-sm hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {cartItems.length > 0 && (
              <div>
                <div className="text-sm">
                  <p className="text-gray-500">VAT = 25%</p>
                  <p>
                    Total price ={" "}
                    <span className="font-bold">Kr {subTotal.toFixed(2)}</span>{" "}
                    (incl. VAT)
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="mt-4 block w-full text-center bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600"
                  onClick={closeCart}
                >
                  Go to checkout
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
