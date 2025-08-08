import Image from "next/image";
import { fetchFeaturedProducts } from "../lib/actions";
import ProductCard from "../ui/catalog/ProductCard";

export default async function Page() {
  const products = await fetchFeaturedProducts();

  return (
    <main>
      <div className="relative">
        <Image
          alt="Hero Image"
          src="/images/portada2.png"
          height={400}
          width={1200}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40">
          <h1 className="text-6xl font-bold">Handcrafted Haven</h1>
          <p className="text-lg mt-4">
            Each piece tells a story you can take with you.
          </p>
        </div>
      </div>
      <h2 className="text-center text-4xl font-semibold py-20">
        Featured Products
      </h2>
      <p className="text-center -mt-16 pb-10 text-lg text-gray-700">
        Buy with purpose and give the best of traditional craftsmanship.
      </p>
      <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 w-full max-w-5xl">
    {products.map((product) => (
      <ProductCard key={product.product_id} product={product} />
    ))}
        </div>
      </div>
    </main>
  );
}
