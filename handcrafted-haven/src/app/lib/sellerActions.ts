"use server";

import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function updateSellerBasics(formData: FormData): Promise<void> {
  const user_id = String(formData.get("user_id"));
  const firstname = String(formData.get("firstname") ?? "");
  const lastname = String(formData.get("lastname") ?? "");
  const category = String(formData.get("category") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const description = String(formData.get("description") ?? "");
  const image_url = String(formData.get("image_url") ?? "");

  await sql.begin(async (tx) => {
    await tx`
      UPDATE users
      SET firstname = ${firstname}, lastname = ${lastname}
      WHERE user_id = ${user_id};
    `;
    await tx`
      UPDATE seller_profile
      SET category = ${category},
          phone = ${phone},
          description = ${description},
          image_url = ${image_url}
      WHERE user_id = ${user_id};
    `;
  });

  revalidatePath(`/profiles/${user_id}`);
  revalidatePath(`/profiles/${user_id}/edit`);
}

export async function updateProductFull(formData: FormData): Promise<void> {
  const product_id = String(formData.get("product_id"));
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const image = String(formData.get("image") ?? "");
  const price = Number(formData.get("price") ?? 0);

  await sql`
    UPDATE product
    SET name = ${name},
        description = ${description},
        image = ${image},
        price = ${price}
    WHERE product_id = ${product_id};
  `;

  revalidatePath(`/list/${product_id}`);
}

export async function createProduct(formData: FormData): Promise<void> {
  const user_id = String(formData.get("user_id"));
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const image = String(formData.get("image") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "");

  await sql`
    INSERT INTO product (name, price, description, image, user_id, category)
    VALUES (${name}, ${price}, ${description}, ${image}, ${user_id}, ${category});
  `;

  revalidatePath(`/profiles/${user_id}`);
  revalidatePath(`/profiles/${user_id}/edit`);
}

export async function updateStoryContent(formData: FormData): Promise<void> {
  const story_id = String(formData.get("story_id"));
  const content = String(formData.get("content") ?? "");
  const user_id = String(formData.get("user_id") ?? "");

  await sql`
    UPDATE stories
    SET content = ${content}
    WHERE story_id = ${story_id};
  `;

  revalidatePath(`/profiles/${user_id}`);
  revalidatePath(`/profiles/${user_id}/edit`);
}

export async function deleteProduct(formData: FormData) {
  const session = await auth();
  const user_id = session?.user?.id;
  const product_id = String(formData.get("product_id"));
  if (!user_id) {
    throw new Error("You must be signed in to delete a product.");
  }
  try {
    await sql`
      DELETE FROM product
      WHERE product_id = ${product_id} AND user_id = ${user_id};
    `;
    revalidatePath(`/profiles/${user_id}`);
    revalidatePath(`/profiles/${user_id}/edit`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product.");
  }
}

export async function deleteStory(formData: FormData) {
  const session = await auth();
  const user_id = session?.user?.id;

  const story_id = String(formData.get("story_id"));

  if (!user_id) {
    throw new Error("You must be signed in to delete a story.");
  }
  try {
    await sql`
      DELETE FROM stories
      WHERE story_id = ${story_id} AND user_id = ${user_id};
    `;
    revalidatePath(`/profiles/${user_id}`);
    revalidatePath(`/profiles/${user_id}/edit`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete story.");
  }
}
