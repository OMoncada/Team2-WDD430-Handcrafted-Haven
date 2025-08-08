// src/app/api/test-db/route.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const seller_profile = await sql`SELECT * FROM seller_profile`;
    console.log("Sellers:", seller_profile);

    return new Response(JSON.stringify(seller_profile), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Failed to fetch sellers", { status: 500 });
  } finally {
    await sql.end(); // optional — remove if connection pooling is used
  }
}
