// src/app/seed/route.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    await seed();
    return new Response("✅ Seeding completed successfully", { status: 200 });
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    return new Response("❌ Error seeding database", { status: 500 });
  }
}

async function seed() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  INSERT INTO users (user_id, firstname, lastname, email, password, user_type)
  VALUES
    ('52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', 'Ada', 'Clay', 'ada@example.com', 'hashed_password1', 'seller'),
    ('8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', 'Chinedu', 'Weave', 'chinedu@example.com', 'hashed_password2', 'seller'),
    ('71c5c963-0673-4f00-82d4-384e9696645d', 'Ngozi', 'Beads', 'ngozi@example.com', 'hashed_password3', 'seller')
`;

  await sql`
    INSERT INTO seller_profile (user_id, image_url, category, phone, description) VALUES
    ('52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', '/images/sellers/vendedoralfarero.png', 'Pottery Artist', '08012345678', 'Handcrafting traditional clay pottery with a modern touch.'),
    ('8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', '/images/sellers/vendedortelas.png', 'Textile Weaver', '08123456789', 'Specializes in woven fabric and textile-based décor.'),
    ('71c5c963-0673-4f00-82d4-384e9696645d', '/images/sellers/vendedorjoyas.png', 'Bead Jewelry Designer', '09012345678', 'Colorful hand-strung African beads made with love.');
  `;

  await sql`
    INSERT INTO product (product_id, user_id, name, price, description, image) VALUES
    ('d174f847-a13b-42e3-b49a-bf6403b17817', '52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', 'Clay Cooking Pot', 4084, 'Perfect for slow-cooked traditional meals.', '/images/sellers/5.png'),
    ('cb01417d-c534-46ea-9751-bd5ec515c86b', '52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', 'Woven Table Runner', 3774, 'Decorative and traditional woven runner.', '/images/carteras.png'),
    ('7bc72f3d-f28f-4fd9-9f23-aadc7bafcec7', '8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', 'Beaded Necklace', 1808, 'Hand-strung necklace using vibrant African beads.', '/images/joya.png'),
    ('cb76a1f2-6d4a-4459-aef8-beed5693f6cd', '8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', 'Handmade Mug', 1627, 'Perfectly shaped ceramic mug.', '/images/sellers/6.png'),
    ('c1c01f66-25b4-40e4-84db-6c31968bcb12', '71c5c963-0673-4f00-82d4-384e9696645d', 'Throw Pillow Cover', 3935, 'Stylish and soft woven pillow cover.', '/images/carteras.png'),
    ('baa1724c-34cc-45d2-8b1d-544f8ebfb1dd', '71c5c963-0673-4f00-82d4-384e9696645d', 'Bracelet Set', 2184, 'A set of matching beaded bracelets.', '/images/sellers/1.png');
  `;

  await sql`
    INSERT INTO stories (story_id, user_id, content, created_at) VALUES
    ('a5da72cb-31c9-4a99-80a1-d6998c1a864a', '52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', 'This is a story about how I created item #1.', NOW() - INTERVAL '1 day'),
    ('b6c5e976-887d-4a5d-a9b1-0b58a75c419f', '52a7a5b3-cb1d-44f5-a94a-5cadcdd55249', 'This is a story about how I created item #2.', NOW() - INTERVAL '2 day'),
    ('47c36916-a67b-4864-9811-638719182845', '8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', 'This is a story about how I created item #1.', NOW() - INTERVAL '1 day'),
    ('e67fc4f2-4d54-4a9d-8de1-c5dc8db5a377', '8d1e754a-d685-4e4b-a88c-9ef02bcb1f12', 'This is a story about how I created item #2.', NOW() - INTERVAL '2 day'),
    ('b1848be6-9800-4046-a5ff-ae1328759164', '71c5c963-0673-4f00-82d4-384e9696645d', 'This is a story about how I created item #1.', NOW() - INTERVAL '1 day'),
    ('c838b93d-8bdb-4c03-adeb-7a7a4e7bd71a', '71c5c963-0673-4f00-82d4-384e9696645d', 'This is a story about how I created item #2.', NOW() - INTERVAL '2 day');
  `;
}
