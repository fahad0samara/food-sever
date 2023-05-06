import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import {NextFunction} from "express";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  created_at: Date;
}

interface IAdmin extends IUser {}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const adminSchema: Schema<IAdmin> = new mongoose.Schema<IAdmin>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving to the database



const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export {User, Admin};
