import { notFound } from "next/navigation";
import postgres from "postgres";
import Image from "next/image";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const seller = await sql`
    SELECT category, image_url, description, phone
    FROM seller_profile
    WHERE user_id = ${id}
  `;

  if (!seller.length) return notFound();

  const profile = seller[0];

  const products = await sql`
    SELECT name, price, image FROM product WHERE user_id = ${id}
  `;

  const stories = await sql`
    SELECT story_id, content, created_at
    FROM stories
    WHERE user_id = ${id}
    ORDER BY created_at DESC
  `;

  return (
    <main className="px-4 py-10 max-w-7xl mx-auto">
      <section className="mb-12 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-5xl mx-auto">
          <div className="w-48 h-48 flex-shrink-0 mt-6">
            <Image
              src={profile.image_url}
              alt={profile.category}
              width={192}
              height={192}
              className="rounded-full object-cover w-full h-full border-4 border-[#5d4037] shadow-md"
            />
          </div>
          <div className="flex-1 bg-white border border-yellow-300 rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-[#3e2723] mb-1">
              {profile.category}
            </h1>
            <p className="text-sm mb-1">
              📞 <strong>Phone:</strong> {profile.phone}
            </p>
            <p className="text-sm mb-4">
              📝 <strong>Bio:</strong> {profile.description}
            </p>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section
        className="py-10 px-4 rounded-lg"
        style={{ backgroundColor: "#fdf6ec" }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#3e2723]">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div key={i} className="bg-white rounded shadow-md p-4">
              <div className="w-full h-40 mb-3 overflow-hidden rounded">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#3e2723]">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                💲<strong>${product.price}</strong>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Historias */}
      <section className="mt-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#3e2723] text-center">
          My Stories
        </h2>
        <div className="grid gap-4">
          {stories.map((story) => (
            <div
              key={story.story_id}
              className="bg-white border border-[#ddd] rounded-lg shadow p-6"
            >
              <p className="text-gray-800 mb-3">{story.content}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Actions */}
      <section className="mt-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#3e2723] text-center">
          Actions
        </h2>
        <div className="flex justify-center gap-4">
          <a
            href={`/profiles/${id}/add-product`}
            className="bg-[#3e2723] text-white px-4 py-2 rounded hover:bg-[#5d4037]"
          >
            Add Product
          </a>
          <a
            href={`/profiles/${id}/add-story`}
            className="bg-[#3e2723] text-white px-4 py-2 rounded hover:bg-[#5d4037]"
          >
            Add Story
          </a>
        </div>
      </section>
    </main>
  );
}
