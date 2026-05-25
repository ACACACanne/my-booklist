import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { requireAuth } from "@/lib/authMiddleware";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const book = await Book.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();

    const updated = await Book.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      body,
      { new: true },
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const action = req.nextUrl.searchParams.get("action");
    const body = await req.json().catch(() => ({}));

    // Always fetch book with userId filter
    const book = await Book.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (action === "readStatus") {
      book.read = !book.read;
    }

    if (action === "rating") {
      book.rating = body.rating;
    }

    await book.save();

    return NextResponse.json(book);
  } catch (err) {
    console.error("PATCH /api/books/:id ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    await Book.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
