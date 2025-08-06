// src/app/products/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithSeller } from "../lib/definitions";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type Props = {
  product: ProductWithSeller;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-[#F4EDE4] rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between">
      <div className="w-72 h-48 mb-4 overflow-hidden rounded m-auto">
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
      <p className="font-bold text-green-600 mb-3 flex gap-2">
        <CurrencyDollarIcon className="w-5" />
        {product.price}
      </p>

      <Link
        href={`/profiles/${product.user_id}`}
        className="text-sm text-blue-600 hover:underline mt-auto"
      >
        By: {product.seller_firstname} {product.seller_lastname} (
        {product.seller_category})
      </Link>

      <Link
        key={product.product_id}
        href={`/profiles/${product.product_id}`}
        className="w-40 mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        See Product
      </Link>
    </div>
  );
}
