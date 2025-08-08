"use server";

import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { ProductWithSeller, SellerProfile, Review } from "./definitions";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* -------------------- REGISTRATION -------------------- */
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

/* -------------------- LOGIN -------------------- */
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

/* -------------------- SELLERS -------------------- */
export async function fetchAllSellers(): Promise<SellerProfile[]> {
  return await sql<SellerProfile[]>`
    SELECT 
      s.category, s.description, s.image_url, s.phone, s.user_id,
      u.firstname AS firstname,
      u.lastname AS lastname
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
      u.lastname AS lastname
    FROM seller_profile s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.user_id = ${seller_id}
  `;
}

/* -------------------- PRODUCTS -------------------- */
export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
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
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
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
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
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
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
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

/* -------------------- STORIES -------------------- */
const storySchema = z.object({
  user_id: z.uuid(),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

type StoryData = z.infer<typeof storySchema>;

export type StoryFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodFormattedError<StoryData>;
  submittedData?: Record<string, string>;
};

export async function fetchStoryBySellerId(seller_id: string) {
  return await sql`
    SELECT story_id, content, created_at
    FROM stories
    WHERE user_id = ${seller_id}
    ORDER BY created_at DESC
  `;
}

export async function postNewStory(
  prevState: StoryFormState | undefined,
  formData: FormData
): Promise<StoryFormState> {
  const rawData = {
    user_id: formData.get("user_id"),
    content: formData.get("content"),
  };
  const result = storySchema.safeParse(rawData);
  if (!result.success) {
    const safeData = { content: rawData.content as string };
    return {
      success: false,
      errors: result.error.format(),
      submittedData: safeData,
    };
  }
  const { user_id, content } = result.data;
  try {
    await sql`
      INSERT INTO stories (user_id, content, created_at)
      VALUES (${user_id}, ${content}, NOW())
    `;
    revalidatePath(`/profiles/${user_id}`);
    return {
      success: true,
      message: "¡Historia publicada con éxito!",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Error al publicar la historia. Por favor, inténtalo de nuevo.",
    };
  }
}

/* -------------------- FILTERED PRODUCTS -------------------- */
export async function fetchFilteredProducts(searchParams: {
  categories?: string;
  sellers?: string;
  price?: string;
}): Promise<ProductWithSeller[]> {
  const { categories, sellers, price } = searchParams;

  const conditions = [];

  if (categories) {
    conditions.push(sql`s.category = ${categories}`);
  }

  if (sellers) {
    conditions.push(sql`u.user_id = ${sellers}`);
  }

  if (price) {
    if (price === "under-15") {
      conditions.push(sql`p.price < 15`);
    } else if (price === "15-30") {
      conditions.push(sql`p.price BETWEEN 15 AND 30`);
    } else if (price === "above-30") {
      conditions.push(sql`p.price > 30`);
    }
  }

  const whereClause =
    conditions.length > 0
      ? sql`WHERE ${conditions.map((c, i) => (i === 0 ? c : sql`AND ${c}`))}`
      : sql``;

  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id
    ${whereClause}
    ORDER BY p.name;
  `;
}

/* -------------------- CATEGORIES -------------------- */
export async function fetchAllCategories(): Promise<
  { category_id: string; category_name: string }[]
> {
  return await sql`
    SELECT DISTINCT category AS category_name, category AS category_id
    FROM seller_profile
  `;
}

// Reviews
const reviewSchema = z.object({
  user_id: z.uuid(),
  product_id: z.uuid(),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});
type ReviewData = z.infer<typeof reviewSchema>;

export type ReviewFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodFormattedError<ReviewData>;
  submittedData?: Record<string, string>;
};

export async function fetchReviewsByProducts(
  product_id: string
): Promise<Review[]> {
  return await sql<Review[]>`
    SELECT 
      r.review_id, r.product_id, r.user_id, r.rating, r.review, r.created_at,
      u.firstname, u.lastname, u.user_id
    FROM review r
    JOIN users u on r.user_id = u.user_id
    WHERE r.product_id = ${product_id}
    ORDER BY r.created_at;
  `;
}

export async function postNewReview(
  prevState: ReviewFormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());

  const result = reviewSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.format(),
      submittedData: rawData as Record<string, string>,
    };
  }

  const { user_id, product_id, rating, review } = result.data;

  try {
    await sql`
      INSERT INTO review (user_id, product_id, rating, review, created_at)
      VALUES (${user_id}, ${product_id}, ${rating}, ${review}, NOW())
    `;
    revalidatePath(`/list/${product_id}`);
    return {
      success: true,
      message: "Review submitted!",
    };
  } catch (error) {
    console.error("Failed to post review:", error);
    return {
      success: false,
      message: "Failed to submit review. Please try again later.",
    };
  }
}

export async function fetchProductStats(product_id: string) {
  try {
    const data = await sql`
      SELECT
        COALESCE(ROUND(AVG(rating), 1), 0.0) AS average_rating,
        COUNT(*) AS review_count
      FROM review
      WHERE product_id = ${product_id};
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product statistics.");
  }
}
