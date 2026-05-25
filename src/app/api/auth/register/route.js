import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const exists = await User.findOne({ username });
    if (exists) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
    });

    const token = signToken(user);

    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
