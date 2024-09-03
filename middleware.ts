import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";

export const config = {
  //   matcher: "/api/:path*",
  matcher: "/api/users",
};

export function middleware(request: NextRequest) {
  console.log("middleware request", request);
  const authResults = authMiddleware(request);
  if (!authResults?.isValid) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  return NextResponse.next();
}
