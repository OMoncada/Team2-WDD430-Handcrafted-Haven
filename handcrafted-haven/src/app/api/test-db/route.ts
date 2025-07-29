import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function testGetAllUsers() {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await sql.end();
  }
}

testGetAllUsers();
