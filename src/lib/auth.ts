import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        // GoogleProvider disabled for local development
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID || "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.hashedPassword) {
                    return null;
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    // Using a hardcoded secret for local development - replace with environment variable in production
    secret: process.env.NEXTAUTH_SECRET || "thisissecretkeyfornextauthlocaldev",
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
}; 