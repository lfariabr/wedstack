import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true,
    },
    password: { 
      type: String, 
      required: true,
      select: false, // Don't return password by default in queries
    },
    role: { 
      type: String, 
      enum: Object.values(UserRole),
      default: UserRole.USER 
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(this: IUser & Document, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate auth token
UserSchema.methods.generateAuthToken = function(this: IUser): string {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export default mongoose.model<IUser>('User', UserSchema);