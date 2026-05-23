import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

// CREATE TOKEN
export function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, SECRET, {
    expiresIn: "7d",
  });
}

// VERIFY TOKEN
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
