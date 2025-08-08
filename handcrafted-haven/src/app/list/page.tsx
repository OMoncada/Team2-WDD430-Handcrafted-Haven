import {
  fetchAllCategories,
  fetchAllSellers,
  fetchFilteredProducts,
} from "@/app/lib/actions";
import FilterSidebar from "@/app/ui/catalog/FilterSidebar";
import ProductCard from "@/app/ui/catalog/ProductCard";

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const products = await fetchFilteredProducts(params);
  const categories = await fetchAllCategories();
  const sellers = await fetchAllSellers();

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-[#3e2723] mb-10">
        All Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4">
          <FilterSidebar
            categories={categories}
            sellers={sellers.map((s) => ({
              id: s.user_id,
              name: `${s.firstname} ${s.lastname}`,
            }))}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-center">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 text-lg mt-12">
                No products match your filters.
                <br />
                Try adjusting or clearing some filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 max-w-7xl">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
