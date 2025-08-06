"use server";

import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { ProductWithSeller } from "./definitions";
import { SellerProfile } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Registration process
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

//Login process
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

//Sellers
export async function fetchAllSellers(): Promise<SellerProfile[]> {
  return await sql<SellerProfile[]>`
    SELECT 
      s.category, s.description, s.image_url, s.phone, s.user_id,
      u.firstname AS firstname,
      u.lastname as lastname
    FROM seller_profile s
    JOIN users u ON s.user_id = u.user_id
  `;
}

export async function fetchSellerById(
  seller_id: string
): Promise<SellerProfile[]> {
  return await sql<SellerProfile[]>`
    SELECT 
      s.category, s.description, s.image_url, s.phone, s.user_id,
      u.firstname AS firstname,
      u.lastname as lastname
    FROM seller_profile s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.user_id = ${seller_id}
  `;
}

// Products

export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
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

export async function fetchProductById(
  product_id: string
): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>` SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id 
    WHERE p.product_id = ${product_id}
    ORDER BY p.name;
  `;
}

export async function fetchProductsBySellerId(
  seller_id: string
): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id 
    WHERE p.user_id = ${seller_id}
    ORDER BY p.name;
  `;
}

export async function fetchFeaturedProducts(): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id
    ORDER BY RANDOM()
    LIMIT 6;
    `;
}

// stories
export async function fetchStoryBySellerId(seller_id: string) {
  return await sql`
    SELECT story_id, content, created_at
    FROM stories
    WHERE user_id = ${seller_id}
    ORDER BY created_at DESC
  `;
}
