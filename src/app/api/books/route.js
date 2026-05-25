import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { requireAuth } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const params = Object.fromEntries(req.nextUrl.searchParams);

    const query = { userId: user.id };

    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }

    if (params.genre) query.genre = params.genre;
    if (params.read) query.read = params.read === "true";
    if (params.minRating) query.rating = { $gte: Number(params.minRating) };

    const books = await Book.find(query);

    return NextResponse.json(books);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();

    // Convert publishedYear to number if needed
    if (body.publishedYear === "") body.publishedYear = null;
    if (typeof body.publishedYear === "string") {
      body.publishedYear = Number(body.publishedYear);
    }

    const book = await Book.create({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(book);
  } catch (err) {
    console.error("POST /api/books ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
