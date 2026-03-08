"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./components/ProductGrid";

function HomeContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <main>
      <ProductGrid searchQuery={searchQuery} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main>
          <p className="p-4">Loading...</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
