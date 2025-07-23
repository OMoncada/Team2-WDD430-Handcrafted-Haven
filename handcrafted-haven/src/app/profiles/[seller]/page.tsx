import Image from "next/image";
import type { Metadata } from "next";

type Product = {
  title: string;
  price: string;
  image: string;
  rating: string;
};

type Seller = {
  name: string;
  specialty: string;
  rating: number;
  image: string;
  products: Product[];
};

type PageProps = {
  params: {
    seller: string;
  };
};

const sellers: Record<string, Seller> = {
  "juan-perez": {
    name: "Juan Pérez",
    specialty: "Alfarería",
    rating: 4.5,
    image: "/images/vendedoralfarero.png",
    products: [],
  },
  "pedro-torres": {
    name: "Pedro Torres",
    specialty: "Madera Tallada",
    rating: 5.0,
    image: "/images/vendedormadera.png",
    products: [
      {
        title: "Tallado de Roble",
        price: "$45.00",
        image: "/images/vendedormadera.png",
        rating: "★★★★★",
      },
      {
        title: "Marco Decorativo",
        price: "$30.00",
        image: "/images/vendedormadera.png",
        rating: "★★★★☆",
      },
    ],
  },
  "luis-gomez": {
    name: "Luis Gómez",
    specialty: "Tejido Andino",
    rating: 4.0,
    image: "/images/vendedortelas.png",
    products: [],
  },
  "mario-ruiz": {
    name: "Mario Ruiz",
    specialty: "Cestería Natural",
    rating: 3.5,
    image: "/images/vendedorcesteria.png",
    products: [],
  },
  "laura-diaz": {
    name: "Laura Díaz",
    specialty: "Joyería Artesanal",
    rating: 5.0,
    image: "/images/vendedorjoyas.png",
    products: [],
  },
  "pia-hiramindani": {
    name: "Pia Hiramindani",
    specialty: "Pintura",
    rating: 4.0,
    image: "/images/vendedorpintura.png",
    products: [],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Perfil de ${params.seller.replace("-", " ")}`,
  };
}

export default async function Page({ params }: PageProps) {
  const seller = sellers[params.seller];

  if (!seller) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Vendedor no encontrado</h1>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <Image
          src={seller.image}
          alt={seller.name}
          width={120}
          height={120}
          className="rounded-full object-cover"
        />
        <h1 className="text-4xl font-bold mt-4">{seller.name}</h1>
        <p className="text-lg">Dedicado a: {seller.specialty}</p>
        <p className="text-yellow-500 text-lg">
          Calificación: {seller.rating.toFixed(1)} ★
        </p>
      </div>

      {seller.products.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Productos por {seller.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {seller.products.map((product, index) => (
              <div
                key={index}
                className="bg-white shadow-[0_4px_10px_rgba(139,69,19,0.4)] rounded-lg overflow-hidden p-4 text-center"
              >
                <div className="w-full h-[200px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
                <p className="text-green-600 text-lg font-semibold mt-1">
                  {product.price}
                </p>
                <div className="text-yellow-400 text-lg mt-2">
                  {product.rating}
                </div>
                <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  Ver Producto
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Este vendedor aún no tiene productos cargados.
        </p>
      )}
    </main>
  );
}
