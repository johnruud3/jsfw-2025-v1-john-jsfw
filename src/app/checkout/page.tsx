"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../components/ShoppingCart";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/successful");
  };

  const subTotal = cartItems.reduce((sum, item) => {
    const price =
      item.product.discountedPrice < item.product.price
        ? item.product.discountedPrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const vat = subTotal * 0.25;
  const totalWithVat = subTotal + vat;

  return (
    <main>
      <div className="flex items-center flex-col container mx-auto px-4 py-30">
        <h1 className="text-2xl font-bold mb-4 mt-4">Checkout</h1>
        {cartItems.length === 0 ? (
          <p>
            Your cart is empty. <Link href="/">Continue shopping</Link>
          </p>
        ) : (
          <ul className="flex flex-col items-center justify-center space-y-4">
            {cartItems.map((item) => {
              const price =
                item.product.discountedPrice < item.product.price
                  ? item.product.discountedPrice
                  : item.product.price;
              const lineTotal = price * item.quantity;
              return (
                <li key={item.product.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.product.image.url}
                    alt={item.product.image.alt}
                    className="w-30 h-30 object-cover rounded"
                  />
                  <div className="md:w-100">
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-600">
                      Kr {price.toFixed(2)} × {item.quantity} = Kr{" "}
                      {lineTotal.toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
            <li className="pt-4">
              <p>Subtotal: Kr {subTotal.toFixed(2)}</p>
              <p>VAT (25%): Kr {vat.toFixed(2)}</p>
              <p className="font-bold">
                Total with VAT: Kr {totalWithVat.toFixed(2)}
              </p>
            </li>
          </ul>
        )}
        <form
          className="w-full max-w-md space-y-4 mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceOrder();
          }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Delivery address"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="payment" className="block text-sm font-medium mb-1">
              Payment method
            </label>
            <select
              id="payment"
              name="paymentMethod"
              className="border cursor-pointer border-gray-300 rounded-md p-2 w-full"
            >
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <button
            disabled={cartItems.length === 0}
            type="submit"
            className="flex mt-4 items-center justify-center cursor-pointer text-white bg-green-400 rounded-md p-2 shadow-md hover:scale-105 transition duration-300 h-10 w-full"
          >
            Place Order
          </button>
        </form>
      </div>
    </main>
  );
}
