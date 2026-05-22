import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  publishedYear: Number,
  coverImageUrl: String,
  purchaseLink: String,
  readOnlineLink: String,
  summary: String,
  rating: { type: Number, default: 0 },
  read: { type: Boolean, default: false },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
