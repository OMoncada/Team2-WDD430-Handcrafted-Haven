"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  categories: { category_id: string; category_name: string }[];
  sellers: { id: string; name: string }[];
};

export default function FilterSidebar({ categories, sellers }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="p-6 rounded-xl shadow-xl bg-[#4e342e] text-white border-2 border-[#3e2723]">
      <h2 className="text-2xl font-bold mb-6 tracking-wide border-b border-[#bcaaa4] pb-2 uppercase text-[#ffe0b2]">
        Filter Products
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-[#ffe0b2]">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.category_id} className="flex items-center text-sm">
              <input
                type="radio"
                name="category"
                value={cat.category_id}
                checked={searchParams.get("categories") === cat.category_id}
                onChange={() =>
                  handleFilterChange("categories", cat.category_id)
                }
                className="mr-3 accent-[#d7ccc8]"
              />
              {cat.category_name}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-t border-[#bcaaa4] my-4" />

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-[#ffe0b2]">Artisans</h3>
        <div className="space-y-2">
          {sellers.map((s) => (
            <label key={s.id} className="flex items-center text-sm">
              <input
                type="radio"
                name="seller"
                value={s.id}
                checked={searchParams.get("sellers") === s.id}
                onChange={() => handleFilterChange("sellers", s.id)}
                className="mr-3 accent-[#d7ccc8]"
              />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-t border-[#bcaaa4] my-4" />

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-[#ffe0b2]">
          Price Range
        </h3>
        <div className="space-y-2 text-sm flex flex-col">
          {[
            { value: "under-15", label: "Under $15" },
            { value: "15-30", label: "$15 – $30" },
            { value: "above-30", label: "Above $30" },
          ].map(({ value, label }) => (
            <label key={value}>
              <input
                type="radio"
                name="price"
                value={value}
                checked={searchParams.get("price") === value}
                onChange={() => handleFilterChange("price", value)}
                className="mr-2 accent-[#d7ccc8]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => router.push(pathname, { scroll: false })}
          className="text-sm text-[#ffe0b2] hover:underline"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}
