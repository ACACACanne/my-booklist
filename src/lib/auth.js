import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
