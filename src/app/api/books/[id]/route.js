import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";
import { requireAuth } from "@/lib/authMiddleware";

// GET single book
export async function GET(req, { params }) {
  try {
    await connectDB();
    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT update book
export async function PUT(req, { params }) {
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

    const updated = await Book.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book updated", book: updated });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PATCH rating / read toggle
export async function PATCH(req, { params }) {
  const { error } = requireAuth(req);
  if (error) return error;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (action === "rating") {
      const body = await req.json();
      const { rating } = body;

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json(
          { message: "Rating must be 1–5" },
          { status: 400 },
        );
      }

      book.rating = rating;
      await book.save();
      return NextResponse.json({ message: "Rating updated", book });
    }

    if (action === "readStatus") {
      book.read = !book.read;
      await book.save();
      return NextResponse.json({
        message: `Book marked as ${book.read ? "read" : "unread"}`,
        book,
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE book
export async function DELETE(req, { params }) {
  const { error } = requireAuth(req);
  if (error) return error;

  try {
    await connectDB();

    const deleted = await Book.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
