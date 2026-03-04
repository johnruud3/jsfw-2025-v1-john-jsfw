"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function SuccessfulPage() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={2} />
      <h1 className="text-2xl font-bold">Congratulations!</h1>
      <p className="text-gray-600">Your order has been placed successfully.</p>
      <p className="text-gray-600">
        We will send you a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="flex gap-2 items-center justify-center cursor-pointer text-white bg-green-400 rounded-md p-2 shadow-md hover:scale-105 transition duration-300 h-10 w-84"
      >
        Continue shopping
      </Link>
    </div>
  );
}
