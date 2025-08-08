import { Suspense } from "react";
import { fetchAllProducts } from "@/app/lib/actions";
import ProductCard from "@/app/ui/ProductCard";
import ProductCardSkeleton from "@/app/ui/ProductCardSkeleton";
import type { ProductWithSeller } from "@/app/lib/actions";

export default async function ProductsPage() {
  const products: ProductWithSeller[] = await fetchAllProducts();

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-[#3e2723] mb-10">
        All Products
      </h1>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </Suspense>
    </main>
  );
}
