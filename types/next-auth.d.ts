// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
        role: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: string;
    };
  }
}