// src/app/api/test-db/route.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const products = await sql`SELECT * FROM product`;
    console.log("Products:", products);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Failed to fetch products", { status: 500 });
  } finally {
    await sql.end(); // optional — remove if connection pooling is used
  }
}
