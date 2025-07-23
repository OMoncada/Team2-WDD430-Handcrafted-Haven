import Image from "next/image";

const products = [
  {
    title: "Jarrón decorativo",
    category: "Alfarería",
    price: "$21.00",
    ratingNumber: "4.0",
    image: "/images/jarron.png",
    seller: "Juan Pérez",
  },
  {
    title: "Tallado de madera",
    category: "Madera Tallada",
    price: "$35.00",
    ratingNumber: "5.0",
    image: "/images/madera.png",
    seller: "Ana Torres",
  },
  {
    title: "Tela Andina",
    category: "Tejido Andino",
    price: "$28.00",
    ratingNumber: "4.0",
    image: "/images/telas.png",
    seller: "Luis Gómez",
  },
  {
    title: "Canasta natural",
    category: "Cestería Natural",
    price: "$18.00",
    ratingNumber: "3.0",
    image: "/images/cestas.png",
    seller: "María Ruiz",
  },
  {
    title: "Collar artesanal",
    category: "Joyería Artesanal",
    price: "$42.00",
    ratingNumber: "5.0",
    image: "/images/joya.png",
    seller: "Laura Díaz",
  },
  {
    title: "Pintura decorativa",
    category: "Pintura",
    price: "$31.00",
    ratingNumber: "4.0",
    image: "/images/pintura.png",
    seller: "Pedro Sánchez",
  },
];

export default function Page() {
  return (
    <main>
      <div className="relative">
        <Image
          alt="Hero Image"
          src="/images/portada2.png"
          height={400}
          width={1200}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40">
          <h1 className="text-6xl font-bold">Handcrafted Haven</h1>
          <p className="text-lg mt-4">
            Each piece tells a story you can take with you.
          </p>
        </div>
      </div>
      <h2 className="text-center text-4xl font-semibold py-20">
        Featured Products
      </h2>
      <p className="text-center -mt-16 pb-10 text-lg text-gray-700">
            Buy with purpose and give the best of traditional craftsmanship.
          </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 max-w-7xl">
          {products.map((product, i) => (
            <div
              key={i}
              className="bg-white shadow-lg shadow-orange-800/30 rounded-lg overflow-hidden p-4 text-left"
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
              <div className="mt-4 space-y-2">
                <p className="font-bold text-lg">{product.title}</p>
                <p><strong></strong> {product.category}</p>
                <p className="text-green-600 font-semibold">
                  <strong></strong> {product.price}
                </p>
                <p>
                  <strong></strong> {product.ratingNumber} ★
                </p>
                <p>
                  <strong></strong> by {product.seller}
                </p>
                <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  Ver Producto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
