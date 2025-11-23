import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";

// Helper: verify JWT
async function auth(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return token ? verifyToken(token) : null;
}

// GET list all books
export async function GET() {
  await connectDB();
  const books = await Book.find({});
  return NextResponse.json(books);
}

// POST add a new book
export async function POST(request) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Create and return the new book
    const book = await Book.create(body);
    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}


