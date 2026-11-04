import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { normalizeIndianMobile } from "./phone";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Accounts store the bare 10 digits, but older ones (e.g. from
        // create-admin.ts) used +91…, so accept either form.
        const phone = normalizeIndianMobile(credentials.phone);
        const user = await prisma.user.findFirst({
          where: {
            phone: { in: [phone, `+91${phone}`, credentials.phone.trim()] },
          },
        });

        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        return token;
      }

      // Re-read role and status so deactivated, demoted or deleted users lose
      // access straight away instead of when their JWT expires.
      if (token.id) {
        const current = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isActive: true },
        });
        if (!current || !current.isActive) {
          token.id = "";
          token.role = "";
        } else {
          token.role = current.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
