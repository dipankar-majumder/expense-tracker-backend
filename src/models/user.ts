import { Document, model } from 'mongoose';
import userSchema from '../schemas/user';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  validPassword(password: string): Promise<boolean>;
}

export interface IUserQuery extends Document {
  name?: string;
  email?: string;
  password?: string;
}

const userModel = model<IUser>('User', userSchema);

export default userModel;
