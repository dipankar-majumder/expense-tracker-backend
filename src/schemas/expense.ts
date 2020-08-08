import { Schema } from 'mongoose';

const expenseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: Number, required: true },
    date: { type: Date, default: new Date() },
  },
  { timestamps: true },
);

export default expenseSchema;
