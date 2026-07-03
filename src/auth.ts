import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z as zod } from "zod";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      authorize: async (credentials) => {
        let user = null;
        const parsedCredentials = zod
          .object({
            email: zod.string().email(),
            password: zod.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // BUSCAR EL CORREO
        user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        if (!bcrypt.compareSync(password, user.password)) return null;

        // REGRESAR EL USUARIO SIN PASSWORD
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  callbacks: {
    // FUNCIONA CON MIDDLEWARE.TS
    // authorized({ auth }) {
    //   console.log({ auth });
    //   return true;
    // },
    async signIn({ user, account, profile: _profile }) {
      // Si es login con GitHub
      if (account?.provider === "github") {
        try {
          // Verificar si el usuario ya existe
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // Si no existe, crearlo
          if (!dbUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                password: bcrypt.hashSync(Math.random().toString(36), 10), // Contraseña aleatoria
                emailVerified: new Date(), // Marcar email como verificado
                role: "user",
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error en signIn callback:", error);
          return false;
        }
      }

      // Si es login con credenciales
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          omit: { password: true },
        });
        console.log({ dbUser });
        token.data = dbUser;
      }
      return token;
    },
    session({ session, token, user: _user }) {
      session.user = token.data as any;
      return session;
    },
  },
});
