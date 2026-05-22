import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";
import { requireAuth } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    await connectDB();

    const { user, error } = requireAuth(req);
    if (error) return error;

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const read = searchParams.get("read") || "";
    const minRating = searchParams.get("minRating") || "";

    const query = { userId: user.id };

    // 🔍 Search (title, author, genre, summary)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    // 🎭 Genre filter
    if (genre) {
      query.genre = genre;
    }

    // 📘 Read/unread filter
    if (read === "true") query.read = true;
    if (read === "false") query.read = false;

    // ⭐ Minimum rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const books = await Book.find(query).sort({ title: 1 });

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
