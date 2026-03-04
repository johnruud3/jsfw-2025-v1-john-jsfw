"use client";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Buttons from "../../components/ProductButtons";
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
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-30">
        <Link className="cursor-pointer" href="/">
          ← Back
        </Link>
        <div className="flex flex-col md:flex-row items-center mt-4 gap-4">
          <img
            src={product.image.url}
            alt={product.image.alt}
            className="w-full max-w-md h-auto rounded-lg"
          />
          <div className="flex gap-5 items-center md:items-start flex-col px-10">
            <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
            <p className="mt-2">{product.description}</p>
            <p className="mt-2">
              {product.discountedPrice < product.price ? (
                <>
                  <span className="line-through text-gray-500">
                    ${product.price}
                  </span>{" "}
                  <span className="text-green-600">
                    ${product.discountedPrice}
                  </span>
                </>
              ) : (
                <>${product.price}</>
              )}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rating: {product.rating}
            </p>
            <p className="text-sm text-gray-500">
              Tags: {product.tags.join(", ")}
            </p>
            <div className="w-50">
              <Buttons product={product} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
