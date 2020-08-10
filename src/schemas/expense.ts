import { Schema, Types } from 'mongoose';
import userModel from '../models/user';

const expenseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: Number, required: true },
    date: { type: Date, default: new Date() },
    user: { type: Types.ObjectId, required: true, ref: userModel },
  },
  { timestamps: true },
);

export default expenseSchema;
