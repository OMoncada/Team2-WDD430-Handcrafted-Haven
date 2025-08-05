// src/app/products/page.tsx
import { fetchAllProducts } from "@/app/lib/actions";
import ProductCard from "@/app/ui/ProductCard";

export default async function ProductsPage() {
  const products = await fetchAllProducts();

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-[#3e2723] mb-10">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </main>
  );
}
