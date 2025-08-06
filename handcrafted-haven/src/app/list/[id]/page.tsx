import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/app/lib/actions";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawProduct = await fetchProductById(id);

  if (!rawProduct.length) return notFound();

  const product = rawProduct[0];

  return (
    <main>
      <div>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={192}
        />
      </div>
    </main>
  );
}
