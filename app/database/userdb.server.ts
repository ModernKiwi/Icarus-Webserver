//  TODO: Add error handling middleware
//  TODO: Add middleware to remove password when getting user account.

import type { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

import { mongoose } from '~/database/db.server';
const { Document, Model, model, Types, Schema, Query } = mongoose;

interface IUser {
  username: string;
  hashedPW: string;
  email?: string;
  account?: {
    admin: boolean;
    registeredAt?: Date;
  };
  // connections?: {
  //   discord?: string;
  //   twitch?: string;
  //   youtube?: string;
  // };
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, index: true, lowercase: true },
  hashedPW: { type: String, required: true },
  account: {
    admin: { type: Boolean, required: true, default: false },
    registeredAt: { type: Date, default: Date.now },
  },
});

export const User = mongoose.models.User || model<IUser>('User', userSchema);

//  Util function
export async function checkUsernameExists(username: string) {
  const user = await User.findOne({ username: username });

  if (user) return true;
  return false;
}

export async function checkEmailExists(email: string) {
  const user = await User.findOne({ email: email });

  if (user) return true;
  return false;
}

export async function verifyUserPassword(username: string, password: string) {
  const result = await User.findOne({ username: username });
  if (result) {
    return await bcrypt.compare(password, result.hashedPW);
  }
  return false;
}

//  Create
export async function createUser(username: string, password: string, email?: string) {
  const user: HydratedDocument<IUser> = new User<IUser>({
    username: username,
    email: email,
    hashedPW: await bcrypt.hash(password, 10),
  });
  // TODO: Add error handling and return error.
  return await user.save();
}

export async function createAdminUser(username: string, password: string, email?: string) {
  const user: HydratedDocument<IUser> = new User<IUser>({
    username: username,
    email: email,
    hashedPW: await bcrypt.hash(password, 10),
    account: {
      admin: true,
    },
  });
  // TODO: Add error handling and return error.
  return await user.save();
}

//  Read
export async function getUser(username: string) {
  return await User.findOne({ username: username });
}

export async function getUserSecure(username: string, password: string) {
  const user = await User.findOne<IUser>({ username: username });
  if (user) {
    const passwordVerified = await bcrypt.compare(password, user.hashedPW);
    if (passwordVerified) return user;
    return null;
  }
  return null;
}
//  Update

//  Delete
export function deleteUserByID() {}
