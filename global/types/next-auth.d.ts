import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }

  interface Account {
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}
