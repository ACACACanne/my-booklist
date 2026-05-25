import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publishedYear: Number,
  coverImageUrl: String,
  purchaseLink: String,
  readOnlineLink: String,
  summary: String,
  rating: { type: Number, default: 0 },
  read: { type: Boolean, default: false },
  userId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
