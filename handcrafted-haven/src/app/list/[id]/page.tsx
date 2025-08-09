import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/app/lib/actions";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth } from "../../../../auth";
import ReviewCard from "@/app/ui/Reviews";
import { fetchReviewsByProducts } from "@/app/lib/actions";
import { EditableDescription } from "@/app/ui/EditableDescription";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawProduct = await fetchProductById(id);

  if (!rawProduct.length) return notFound();

  const product = rawProduct[0];

  const session = await auth();
  const reviews = await fetchReviewsByProducts(id);

  return (
    <main>
      <div className="flex flex-col sm:flex-row justify-center gap-10 items-center">
        <div className="flex flex-col items-center justify-center gap-5 mt-10">
          <h1 className="text-3xl font-bold py-3">{product.name}</h1>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={192}
            className="border-2 border-black rounded-2xl"
          />
          <div>
            <EditableDescription
              product={product}
              isOwner={session?.user.id === product.user_id}
            />
            <p className="text-xl font-bold py-2">{product.category}</p>
            <p className="font-bold text-green-600 mb-3 flex gap-2">
              <CurrencyDollarIcon className="w-5" />
              {product.price}
            </p>
            <Link
              href={`/profiles/${product.user_id}`}
              className="text-blue-600 hover:underline mt-auto"
            >
              By: {product.seller_firstname} {product.seller_lastname}
            </Link>
          </div>
        </div>
        <div>
          <ReviewCard
            authenticated={session}
            reviews={reviews}
            product_id={id}
          />
        </div>
      </div>
    </main>
  );
}
