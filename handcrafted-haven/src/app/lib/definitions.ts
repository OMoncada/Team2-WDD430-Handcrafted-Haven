export type User = {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  user_type: "admin" | "seller" | "user";
};

export type Products = {
  product_id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export type Review = {
  review_id: string;
  review?: string;
  rating: number;
};
