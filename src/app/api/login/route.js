import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request) {
  await connectDB();
  const { username, password } = await request.json();

  // Exclusive admin login via env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = signToken({ sub: 'admin', role: 'admin', username });
    return NextResponse.json({ token, username }, { status: 200 });
  }

  const user = await User.findOne({ username });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const ok = await comparePassword(password, user.password);
  if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const token = signToken({ sub: user._id.toString(), role: 'user', username: user.username });
  return NextResponse.json({ token, username: user.username }, { status: 200 });
}

