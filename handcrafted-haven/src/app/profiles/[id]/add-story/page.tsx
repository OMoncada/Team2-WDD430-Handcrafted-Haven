"use client";

import { addStory } from "@/app/lib/actions";

export default function AddStoryPage({ params }: { params: { id: string } }) {
  return (
    <main className="px-4 py-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Story</h1>

      <form
        action={(formData) => addStory(params.id, formData)}
        className="space-y-4"
      >
        <textarea
          name="content"
          placeholder="Write your story..."
          className="w-full border p-2"
          required
        />

        <button
          type="submit"
          className="bg-[#3e2723] text-white px-4 py-2 rounded"
        >
          Post Story
        </button>
      </form>
    </main>
  );
}
