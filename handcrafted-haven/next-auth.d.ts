import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstname: string;
      user_type: "admin" | "seller" | "user";
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    firstname: string;
    user_type: "admin" | "seller" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstnme: string;
    user_type: "admin" | "seller" | "user";
  }
}
