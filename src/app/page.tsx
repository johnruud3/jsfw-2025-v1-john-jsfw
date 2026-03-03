"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";

export default function Home() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <main>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ProductGrid searchQuery={searchQuery} />
      <Footer />
    </main>
  );
}
