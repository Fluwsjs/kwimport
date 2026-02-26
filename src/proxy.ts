import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Proxy (middleware) — controleert admin-sessie via JWT-cookie.
 * Importeert GEEN Prisma of andere Node.js-only dependencies.
 * Gebruikt jose direct (edge-compatible) voor token verificatie.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    // NextAuth v5 zet de sessie als JWT in een van deze cookies
    const token =
      request.cookies.get("authjs.session-token")?.value ??
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET ?? "fallback-secret"
      );
      await jwtVerify(token, secret);
    } catch {
      // Ongeldige of verlopen token → terug naar login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
