import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Book from '@/models/Book';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const books = await Book.find().sort({ createdAt: -1 });
  return NextResponse.json(books);
}

export async function POST(request) {
  await connectDB();
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const book = await Book.create({ ...data, ownerId: payload.sub === 'admin' ? null : payload.sub });
  return NextResponse.json(book, { status: 201 });
}
