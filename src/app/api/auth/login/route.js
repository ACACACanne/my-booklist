import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 },
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 },
      );
    }

    const token = signToken(user);

    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
