// src/app/ui/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="bg-gray-100 animate-pulse rounded-lg p-4 shadow-md flex flex-col justify-between">
      <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
}
