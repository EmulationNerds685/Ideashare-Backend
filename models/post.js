import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  code:Number,
  title: String,
  content: String,
  author: String
}, {
  timestamps: true // ✅ This enables both createdAt and updatedAt
});

export default mongoose.model('Post', postSchema);
