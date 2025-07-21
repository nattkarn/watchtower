import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // console.log("🧱 Middleware Activated");
  // console.log("🍪 Cookies:", request.cookies.getAll());

  const pathname = request.nextUrl.pathname;
  // console.log("🧭 Pathname:", pathname);

  const level = request.cookies.get("watchtower_user_level")?.value;



  
  // console.log("🔍 Level:", level);

  // ✅ เงื่อนไขตรวจ path แบบละเอียด
  if (pathname.startsWith("/user")) {
    // console.log("✅ Path '/user' is admin-only");
    if (level !== "ADMIN") {
      // console.log("🚫 Redirecting to /unauthorized (user not admin)");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/user", "/user/:path*", "/dashboard"],
};
