"use server";

import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const registerSchema = z
  .object({
    firstname: z.string().min(1, "First name must be at least 3 characters."),
    lastname: z.string().min(1, "Last name must be at least 3 characters."),
    email: z.string().email("Please enter a valid email."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z.string().min(8),
    user_type: z.enum(["user", "seller"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export type RegisterResult = {
  success: boolean;
  errors?: z.ZodFormattedError<RegisterData>;
  message?: string;
  submittedData?: Record<string, string>;
};

export async function register(
  prevState: RegisterResult | undefined,
  formData: FormData
): Promise<RegisterResult> {
  const rawData = Object.fromEntries(formData.entries());

  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.format(),
      submittedData: rawData as Record<string, string>,
    };
  }

  const { firstname, lastname, email, password, user_type } = result.data;

  try {
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing.count > 0) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (firstname, lastname, email, password, user_type)
      VALUES (${firstname}, ${lastname}, ${email}, ${hashedPassword}, ${user_type})
    `;

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
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

// src/app/products/actions.ts
// import postgres from "postgres";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type ProductWithSeller = {
  product_id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  user_id: string;
  seller_category: string;
  seller_firstname: string;
  seller_lastname: string;
};

export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
  await new Promise((res) => setTimeout(res, 2000)); // simulate delay
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.name;
  `;
}
