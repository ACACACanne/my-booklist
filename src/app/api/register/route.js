export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    const reserved = process.env.ADMIN_USERNAME?.toLowerCase() || "admin";
    if (username?.toLowerCase() === reserved) {
      return NextResponse.json({ message: "Username reserved" }, { status: 403 });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return NextResponse.json({ message: "Email or username already in use" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed });

    return NextResponse.json(
      { message: "Registered", user: { id: user._id, username: user.username } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}




