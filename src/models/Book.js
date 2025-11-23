import mongoose, { Schema } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, default: '' },
  publishedYear: { type: Number },
  coverImageUrl: { type: String, default: '' },
  purchaseLink: { type: String, default: '' },
  readOnlineLink: { type: String, default: '' },
  read: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  ratings: { type: [Number], default: [] },
  summary: { type: String, default: '' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);

