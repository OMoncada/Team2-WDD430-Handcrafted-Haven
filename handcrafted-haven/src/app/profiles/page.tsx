import Image from "next/image";
import Link from "next/link";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

type SellerProfile = {
  user_id: string;
  image_url: string;
  category: string;
  phone: string;
  description: string;
};

export default async function ProfilesPage() {
  const sellers = await sql<SellerProfile[]>`
    SELECT * FROM seller_profile
  `;

  return (
    <main className="px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#3e2723]">
        Seller Profiles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sellers.map((seller) => (
          <Link
            key={seller.user_id}
            href={`/profiles/${seller.user_id}`}
            className="bg-[#3e2723] text-white shadow-lg rounded-lg overflow-hidden text-center p-6 transition-transform hover:scale-105"
          >
            <div className="w-full h-[200px] overflow-hidden rounded-full mb-4">
              <Image
                src={seller.image_url}
                alt={seller.category}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold">{seller.category}</h2>
            <p className="mt-2 text-sm">{seller.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
//end//