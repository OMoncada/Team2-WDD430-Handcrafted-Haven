"use server";

import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const registerSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string(),
  password: z.string().min(6),
  user_type: z.enum(["user", "seller"]),
});

export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  const raw = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    user_type: formData.get("user_type"),
  };

  const result = registerSchema.safeParse(raw);

  if (!result.success) {
    return "Invalid input data.";
  }

  const { firstname, lastname, email, password, user_type } = result.data;

  try {
    const existing = await sql`SELECT * FROM user WHERE email = ${email}`;
    if (existing.length > 0) {
      return "User already exists.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO user (firstname, lastname, email, password, user_type)
      VALUES (${firstname}, ${lastname}, ${email}, ${hashedPassword}, ${user_type})
    `;

    return undefined;
  } catch (error) {
    console.error("Registration failed:", error);
    return "Registration failed.";
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
