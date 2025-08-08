import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductsBySellerId } from "@/app/lib/actions";
import ProductCard from "@/app/ui/catalog/ProductCard";
import { fetchSellerById } from "@/app/lib/actions";
import { fetchStoryBySellerId } from "@/app/lib/actions";
import { PhoneIcon } from "@heroicons/react/16/solid";
import { BookOpenIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { auth } from "../../../../auth";
import { StoryTrigger } from "@/app/ui/catalog/stories/StorieTrigger";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const seller = await fetchSellerById(id);

  if (!seller.length) return notFound();

  const profile = seller[0];

  const products = await fetchProductsBySellerId(id);

  const stories = await fetchStoryBySellerId(id);

  return (
    <main className="px-4 py-10 max-w-7xl mx-auto">
      <section className="mb-12 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
          <div className="w-48 h-48 flex-shrink-0 ">
            <Image
              src={profile.image_url}
              alt={profile.category}
              width={192}
              height={192}
              className="rounded-full object-cover w-full h-full border-4 border-[#5d4037] shadow-md"
            />
          </div>
          <div className="flex-1 bg-white border border-black rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-[#3e2723] mb-1 flex gap-2">
              <UserCircleIcon className="w-10 text-black" />
              {profile.firstname} {profile.lastname}
            </h1>
            <h2 className="text-2xl mb-2">{profile.category}</h2>
            <p className="text-sm mb-1 flex gap-1">
              <PhoneIcon className="w-5" /> <strong>Phone:</strong>
              {profile.phone}
            </p>
            <p className="text-sm mb-4 flex gap-1">
              <BookOpenIcon className="w-5" />
              <strong>Bio:</strong> {profile.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 px-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#3e2723]">
          Products
        </h2>
        <div className="flex flex-wrap gap-10 justify-center">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="mt-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#3e2723] text-center">
          My Stories
        </h2>
        <div className="flex flex-col">
          {stories.length ? (
            stories.map((story) => (
              <div
                key={story.story_id}
                className="bg-[#F4EDE4] border border-[#ddd] rounded-lg shadow p-6"
              >
                <p className="text-gray-800 mb-3">{story.content}</p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 text-black" />
                  {new Date(story.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-[#F4EDE4] border border-[#ddd] rounded-lg shadow p-6">
              <p className="text-gray-800 mb-3">No stories yet.</p>
            </div>
          )}
        </div>
        {session?.user.id === id ? <StoryTrigger user_id={id} /> : <></>}
      </section>
    </main>
  );
}
