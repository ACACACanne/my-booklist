import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";

// GET all books
export async function GET() {
  try {
    await connectDB();
    const books = await Book.find().sort({ title: 1 });
    return NextResponse.json(books);
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}

// POST create book
export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Missing token" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();

    if (body.publishedYear === "" || body.publishedYear === null) {
      delete body.publishedYear;
    } else if (typeof body.publishedYear === "string") {
      body.publishedYear = parseInt(body.publishedYear);
    }

    const book = await Book.create(body);

    return NextResponse.json(
      { message: "Book created successfully", book },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
