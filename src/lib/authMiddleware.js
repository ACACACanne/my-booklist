import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req) {
  const header = req.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Missing or invalid token" },
      { status: 401 },
    );
  }

  const token = header.split(" ")[1];

  try {
    const user = verifyToken(token);
    return user; // <-- RETURN USER DIRECTLY
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
