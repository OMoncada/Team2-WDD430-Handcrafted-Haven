import { NextResponse } from "next/server";
import postgres from "postgres";
import { auth } from "../../../../../../../auth"; // adjust this import based on your auth setup

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const product_id = params.id;
    const currentUserId = session.user.id;

    const { description } = await request.json();

    const productOwner = await sql<{ user_id: string }[]>`
      SELECT user_id FROM product WHERE product_id = ${product_id}
    `;

    if (productOwner.length === 0) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (productOwner[0].user_id !== currentUserId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await sql`
      UPDATE product SET description = ${description} WHERE product_id = ${product_id}
    `;

    return NextResponse.json({ message: "Description updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update description" },
      { status: 500 }
    );
  }
}
