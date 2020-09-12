import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../models/user';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.virtual('firstName').get(function (this: IUser) {
  return this.name.split(' ')[0];
});

userSchema.virtual('lastName').get(function (this: IUser) {
  return this.name.split(' ')[1];
});

userSchema.pre<IUser>('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.method('validPassword', async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
  }
  return false;
});

export default userSchema;
