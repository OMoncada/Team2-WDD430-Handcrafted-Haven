// src/app/products/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithSeller } from "@/app/lib/actions";

type Props = {
  product: ProductWithSeller;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between">
      <div className="w-full h-48 mb-4 overflow-hidden rounded">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={192}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-xl font-semibold text-[#3e2723]">{product.name}</h2>
      <p className="text-sm text-gray-700 mt-1 mb-2">{product.description}</p>
      <p className="font-bold text-[#4e342e] mb-3">💲{product.price}</p>

      <Link
        href={`/profiles/${product.user_id}`}
        className="text-sm text-blue-600 hover:underline mt-auto"
      >
        Seller: {product.seller_firstname} {product.seller_lastname} (
        {product.seller_category})
      </Link>
    </div>
  );
}
