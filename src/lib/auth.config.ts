import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — geen Prisma of Node.js-only imports.
 * Gebruikt in middleware (proxy.ts) voor JWT-sessiecheck.
 * De volledige config met Credentials provider staat in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn   = !!auth?.user;
      const isAdminRoute =
        nextUrl.pathname.startsWith("/admin") &&
        !nextUrl.pathname.startsWith("/admin/login");

      if (isAdminRoute) {
        return isLoggedIn; // niet ingelogd → redirect naar login
      }

      return true;
    },
  },
  providers: [], // providers worden in auth.ts toegevoegd
} satisfies NextAuthConfig;
