import Image from "next/image";

export default function Page() {
  return (
    <main>
      <div>
        <h1 className="text-center text-6xl py-32">Handcrafted Haven</h1>
      </div>
      <div>
        <Image
          alt="Hero Image"
          src="/images/hero-placeholder.webp"
          height={400}
          width={1200}
          className="m-auto"
        />
      </div>
      <h2 className="text-center text-3xl font-semibold py-5">
        Featured Products
      </h2>
      <div className="flex flex-row justify-center gap-8">
        <div className="flex flex-col gap-20">
          <Image
            alt="Featured Image"
            src="/images/placeholder.webp"
            height={350}
            width={512}
          />
          <Image
            alt="Featured Image"
            src="/images/placeholder.webp"
            height={350}
            width={512}
          />
        </div>
        <div className="flex flex-col gap-20">
          <Image
            alt="Featured Image"
            src="/images/placeholder.webp"
            height={350}
            width={512}
          />
          <Image
            alt="Featured Image"
            src="/images/placeholder.webp"
            height={350}
            width={512}
          />
        </div>
      </div>
    </main>
  );
}
