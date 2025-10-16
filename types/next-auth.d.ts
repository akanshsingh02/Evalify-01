import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role?: import("@/lib/utils").AppUserRole
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: import("@/lib/utils").AppUserRole
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: import("@/lib/utils").AppUserRole
  }
}


