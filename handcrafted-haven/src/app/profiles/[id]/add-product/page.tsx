"use client";

import { addProduct } from "@/app/lib/actions";

export default function AddProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="px-4 py-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form
        action={(formData) => addProduct(params.id, formData)}
        className="space-y-4"
      >
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-2"
          required
        />

        <button
          type="submit"
          className="bg-[#3e2723] text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </main>
  );
}
