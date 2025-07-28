import Image from "next/image";

const sellers = [
  {
    name: "Juan Pérez",
    specialty: "Alfarería",
    rating: 4.5,
    image: "/images/vendedoralfarero.png",
    slug: "juan-perez",
  },
  {
    name: "Pedro Torres",
    specialty: "Madera Tallada",
    rating: 5.0,
    image: "/images/vendedormadera.png",
    slug: "pedro-torres",
  },
  {
    name: "Luis Gómez",
    specialty: "Tejido Andino",
    rating: 4.0,
    image: "/images/vendedortelas.png",
    slug: "luis-gomez",
  },
  {
    name: "Mario Ruiz",
    specialty: "Cestería Natural",
    rating: 3.5,
    image: "/images/vendedorcesteria.png",
    slug: "mario-ruiz",
  },
  {
    name: "Laura Díaz",
    specialty: "Joyería Artesanal",
    rating: 5.0,
    image: "/images/vendedorjoyas.png",
    slug: "laura-diaz",
  },
  {
    name: "Pia Hiramindani",
    specialty: "Pintura",
    rating: 4.0,
    image: "/images/vendedorpintura.png",
    slug: "pia-hiramindani",
  },
];

export default function Page() {
  return (
    <main className="px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12">Seller Profiles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sellers.map((seller, i) => (
          <div
            key={i}
            className="bg-[#3e2723] text-white shadow-lg rounded-lg overflow-hidden text-center p-6"
          >
            <div className="w-full h-[200px] overflow-hidden rounded-full mb-4">
              <Image
                src={seller.image}
                alt={seller.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold">{seller.name}</h2>
            <p className="mt-2 text-lg">
              Dedicado a: <span className="font-medium">{seller.specialty}</span>
            </p>
            <p className="mt-1 text-yellow-400">
              Calificación: {seller.rating.toFixed(1)} ★
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
