import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Book from '@/models/Book';
import { verifyToken } from '@/lib/auth';

async function auth(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  return payload;
}

export async function PUT(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const book = await Book.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(book);
}

export async function DELETE(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await Book.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}

// Custom endpoints using query param "action"
export async function PATCH(request, { params }) {
  await connectDB();
  const payload = await auth(request);
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'rating') {
    const { rating } = await request.json();
    const clamped = Math.max(0, Math.min(rating, 5));
    const book = await Book.findByIdAndUpdate(params.id, { rating: clamped }, { new: true });
    return NextResponse.json(book);
  }

  if (action === 'readStatus') {
    const book = await Book.findById(params.id);
    book.read = !book.read;
    await book.save();
    return NextResponse.json(book);
  }

  return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
}

