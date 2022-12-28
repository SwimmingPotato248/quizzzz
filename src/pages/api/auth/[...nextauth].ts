import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed

import { prisma } from "@/src/server/db/client";
import * as argon2 from "argon2";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.password || !credentials.username)
          return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const pwMatch = await argon2.verify(
          user.password,
          credentials.password
        );

        if (!pwMatch) return null;
        else return { id: user.id, name: user.username };
      },
    }),
  ],
};

export default NextAuth(authOptions);
