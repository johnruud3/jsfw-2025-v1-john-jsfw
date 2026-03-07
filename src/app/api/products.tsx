"use client";
import { useEffect, useState } from "react";

// https://docs.noroff.dev/docs/v2/basic/online-shop

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: {
    url: string;
    alt: string;
  };
  rating: number;
  tags: string[];
  reviews: {
    id: string;
    username: string;
    rating: number;
    description: string;
  }[];
};

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://v2.api.noroff.dev/online-shop")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => setProducts(data.data ?? []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`https://v2.api.noroff.dev/online-shop/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch product");
        return response.json();
      })
      .then((data) => setProduct(data.data ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}
