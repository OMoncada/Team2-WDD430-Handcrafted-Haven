"use client";

import { useState } from "react";

type Props = {
  initialDescription: string | null;
  productId: string;
  currentUserId: string | null;
  productOwnerId: string;
  //   onUpdated: () => void;
};

export default function EditableDescription({
  initialDescription,
  productId,
  currentUserId,
  productOwnerId,
}: Props) {
  const [isEditing, setIsEditing] = useState(!initialDescription); // auto-edit if no description
  const [description, setDescription] = useState(initialDescription || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canEdit = currentUserId === productOwnerId;

  async function saveDescription() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update description");
      }

      setIsEditing(false);
      window.location.reload(); // Reload to reflect changes
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!canEdit) {
    // Just display description or "No description yet"
    return <p>{initialDescription || "No description yet."}</p>;
  }

  return (
    <div>
      {isEditing ? (
        <>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={loading}
            placeholder="Add your product description here"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={saveDescription}
              disabled={loading || !description.trim()}
              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialDescription
                ? "Save"
                : "Add Description"}
            </button>
            <button
              onClick={() => {
                setDescription(initialDescription || "");
                setIsEditing(false);
                setError(null);
              }}
              disabled={loading}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-600 mt-1">{error}</p>}
        </>
      ) : (
        <>
          <p>{initialDescription || "No description yet."}</p>
          <button
            className="text-blue-600 mt-2 underline"
            onClick={() => setIsEditing(true)}
          >
            {initialDescription ? "Edit Description" : "Add Description"}
          </button>
        </>
      )}
    </div>
  );
}
