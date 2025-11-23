import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/auth";

async function auth(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return token ? verifyToken(token) : null;
}

export async function PUT(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    // 👇 Use _id instead of id
    const book = await Book.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}



// DELETE → remove book
export async function DELETE(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await Book.findOneAndDelete({ _id: params.id });
  if (!deleted) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Deleted' });
}

// PATCH → rating or readStatus
export async function PATCH(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'rating') {
    const { rating } = await request.json().catch(() => ({}));
    const num = Number(rating);
    if (isNaN(num)) {
      return NextResponse.json({ message: 'Rating must be a number' }, { status: 400 });
    }
    const clamped = Math.max(0, Math.min(num, 5));
    const book = await Book.findOneAndUpdate(
      { _id: params.id },
      { rating: clamped },
      { new: true }
    );
    if (!book) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(book);
  }

  if (action === 'readStatus') {
    const book = await Book.findOne({ _id: params.id });
    if (!book) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    book.read = !book.read;
    await book.save();
    return NextResponse.json(book);
  }

  return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
}






