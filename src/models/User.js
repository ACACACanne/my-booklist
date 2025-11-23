import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email:    { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);


