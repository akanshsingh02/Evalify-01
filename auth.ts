import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongo-client"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { UserModel } from "@/models/user"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        await connectToDatabase()
        const user = await UserModel.findOne({ email: credentials.email }).lean()
        if (!user || !user.password) return null
        try {
          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null
        } catch {
          return null
        }
        return { id: String(user._id), email: user.email, name: user.name, role: user.role } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user && (user as any).role) token.role = (user as any).role
      if (trigger === "update" && session?.user?.role) token.role = session.user.role as any
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = (token as any).role
      }
      return session
    },
  },
  pages: { signIn: "/login" },
}

export function auth() {
  return getServerSession(authOptions)
}

export const { GET, POST } = NextAuth(authOptions)


