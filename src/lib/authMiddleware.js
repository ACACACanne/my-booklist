import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return {
      error: NextResponse.json({ message: "Missing token" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return {
      error: NextResponse.json({ message: "Missing token" }, { status: 401 }),
    };
  }

  const user = verifyToken(token);
  if (!user) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }

  return { user };
}
