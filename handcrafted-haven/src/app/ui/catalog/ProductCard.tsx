"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithSeller } from "../../lib/definitions";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type Props = {
  product: ProductWithSeller;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-[#F4EDE4] rounded-lg shadow-md border border-[#3e2723] overflow-hidden flex flex-col h-full">
      <div className="w-full h-48 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h2 className="text-xl font-semibold text-[#3e2723]">{product.name}</h2>
        <p className="text-sm text-gray-700">{product.description}</p>

        <p className="font-bold text-green-600 flex items-center gap-1">
          <CurrencyDollarIcon className="w-5 h-5" />
          ${product.price}
        </p>

        <Link
          href={`/profiles/${product.user_id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          By: {product.seller_firstname} {product.seller_lastname} (
          {product.seller_category})
        </Link>

        <button className="w-full mt-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          See Product
        </button>
      </div>
    </div>
  );
}
