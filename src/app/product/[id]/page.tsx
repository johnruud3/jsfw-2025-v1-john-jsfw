"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "../../api/products";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { product, loading, error } = useProduct(id);

  if (loading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">← Back</Link>
      <div className="mt-4">
        <img
          src={product.image.url}
          alt={product.image.alt}
          className="w-full max-w-md h-auto rounded-lg"
        />
        <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
        <p className="mt-2">{product.description}</p>
        <p className="mt-2">
          {product.discountedPrice < product.price ? (
            <>
              <span className="line-through text-gray-500">
                ${product.price}
              </span>{" "}
              <span className="text-green-600">${product.discountedPrice}</span>
            </>
          ) : (
            <>${product.price}</>
          )}
        </p>
        <p className="text-sm text-gray-500 mt-2">Rating: {product.rating}</p>
        <p className="text-sm text-gray-500">Tags: {product.tags.join(", ")}</p>
      </div>
    </div>
  );
}
