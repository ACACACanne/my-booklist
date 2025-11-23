import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  await connectDB();
  const { username, email, password } = await request.json();

  // Reserve "admin" username
  if (username?.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase()) {
    return NextResponse.json({ message: 'Username reserved' }, { status: 403 });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return NextResponse.json({ message: 'Email or username already in use' }, { status: 409 });

  const hashed = await hashPassword(password);
  const user = await User.create({ username, email, password: hashed });

  return NextResponse.json({ message: 'Registered', user: { id: user._id, username: user.username } }, { status: 201 });
}

