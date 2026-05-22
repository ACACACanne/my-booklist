import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";
import { requireAuth } from "@/lib/authMiddleware";

// GET all books
export async function GET() {
  try {
    await connectDB();
    const { user, error } = requireAuth(req);
    if (error) return error;
    const books = await Book.find({ userID: user.id }).sort({ title: 1 });
    return NextResponse.json(books);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST create book
export async function POST(req) {
  const { error } = requireAuth(req);
  if (error) return error;

  try {
    await connectDB();

    const body = await req.json();

    if (body.publishedYear === "" || body.publishedYear === null) {
      delete body.publishedYear;
    } else if (typeof body.publishedYear === "string") {
      body.publishedYear = parseInt(body.publishedYear);
    }

    const book = await Book.create(body)({
      ...body,
      userID: userAgent.userID, // associate book with user
    });

    return NextResponse.json(
      { message: "Book created", book },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
