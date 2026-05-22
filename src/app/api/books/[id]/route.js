import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (!id) {
      return NextResponse.json({ message: "Missing book ID" }, { status: 400 });
    }

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    // ⭐ Handle rating update
    if (action === "rating") {
      const body = await req.json();
      const { rating } = body;

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json(
          { message: "Rating must be between 1 and 5" },
          { status: 400 },
        );
      }

      book.rating = rating;
      await book.save();

      return NextResponse.json({ message: "Rating updated", book });
    }

    // ⭐ Handle read/unread toggle
    if (action === "readStatus") {
      book.read = !book.read;
      await book.save();

      return NextResponse.json({
        message: `Book marked as ${book.read ? "read" : "unread"}`,
        book,
      });
    }

    // ❌ Invalid action
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
