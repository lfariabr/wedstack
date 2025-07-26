import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  imageUrl?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true 
    },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    imageUrl: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Middleware to set publishedAt when published becomes true
ArticleSchema.pre('save', function(next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
