"use client";
import useProducts from "../api/products";
import type { Product } from "../api/products";
import { useMemo, useState, useEffect } from "react";
import { TicketPercent, ShoppingCart } from "lucide-react";
import Link from "next/link";

type ProductGridProps = {
  searchQuery?: string;
};

export default function ProductGrid({ searchQuery = "" }: ProductGridProps) {
  const { products } = useProducts();

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(q);
    const tagMatch = p.tags.some((tag) => tag.toLowerCase().includes(q));
    return titleMatch || tagMatch;
  });

  return (
    <div className="grid grid-cols-1 gap-5 px-10 mt-25">
      <div className="flex flex-1 flex-col md:flex-row gap-8">
        <BestDeals products={products} />
      </div>
      <h2 className="text-2xl font-bold">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-10 mt-10">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

//Move this to its own component sheet
function BestDeals({ products }: { products: Product[] }) {
  const bestDeals = useMemo(() => {
    return [
      ...products
        .filter((p) => p.discountedPrice < p.price)
        .sort((a, b) => {
          const gapA = a.price - a.discountedPrice;
          const gapB = b.price - b.discountedPrice;
          return gapB - gapA;
        })
        .slice(0, 4),
    ];
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % bestDeals.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bestDeals.length]);
  return (
    <section className="border-b border-gray-300 pb-10">
      <div className="flex gap-8">
        <div className="hidden md:flex flex-1 flex-col gap-2">
          <p className="font-bold text-green-500 py-10 text-5xl lg:text-7xl">
            Check out our best deals on the products you love today!
          </p>
        </div>
        <div className="flex-1">
          {bestDeals.length > 0 && (
            <>
              <div className="rounded-lg border border-gray-300 shadow-md cursor-pointer overflow-hidden">
                <img
                  src={bestDeals[currentIndex].image.url}
                  alt={bestDeals[currentIndex].image.alt}
                  className="w-full h-96 object-cover"
                />
                <div className="flex flex-col justify-center items-center gap-2 p-2">
                  <h3 className="text-lg font-bold">
                    {bestDeals[currentIndex].title}
                  </h3>
                  <p className="flex flex-col justify-center items-center gap-2">
                    <DiscountPrice product={bestDeals[currentIndex]} />
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function DiscountPrice({ product }: { product: Product }) {
  if (product.discountedPrice < product.price) {
    return (
      <>
        <p className="text-gray-500 line-through">${product.price}</p>
        <p className="flex gap-2 text-green-500">
          ${product.discountedPrice} <TicketPercent />
        </p>
      </>
    );
  }
  return <p>Price: ${product.price}</p>;
}

function ProductCard({ product }: { product: Product }) {
  if (!product) return null;
  return (
    <div className="grid grid-cols-1 gap-2 border border-gray-300 rounded-md p-2 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="cursor-pointer">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image.url}
            alt={product.image.alt}
            className="w-full h-70 rounded-md overflow-hidden object-cover"
          />
        </Link>
      </div>
      <div className="cursor-pointer w-fit">
        <h2 className="text-lg font-bold">{product.title}</h2>
      </div>
      <p className="text-sm text-gray-500">
        {product.description.length > 100
          ? product.description.slice(0, 50) + "..."
          : product.description}
      </p>
      <DiscountPrice product={product} />
      <div className="flex flex-col gap-2 flex-1 mt-2 justify-end">
        <button className="flex items-center justify-center cursor-pointer text-white bg-green-500 rounded-md p-2 shadow-md hover:scale-105 transition duration-300 h-10 w-full">
          Buy
        </button>
        <button className="flex gap-2 items-center justify-center cursor-pointer text-white bg-gray-400 rounded-md p-2 shadow-md hover:scale-105 transition duration-300 h-10 w-full">
          <ShoppingCart /> Add to cart
        </button>
      </div>
      <div className="flex justify-between gap-5">
        <p className="text-gray-500 text-sm">Ratings: {product.rating}</p>
        <p className="text-gray-500 text-sm">
          {product.reviews.length} reviews
        </p>
      </div>
      <p className="text-xs text-gray-500">Tags: {product.tags.join(", ")}</p>
    </div>
  );
}
