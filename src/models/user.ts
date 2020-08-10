import { Document, model } from 'mongoose';
import userSchema from '../schemas/user';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

export interface UserQuery extends Document {
  name?: string;
  email?: string;
  password?: string;
}

const userModel = model<User>('User', userSchema);

export default userModel;
