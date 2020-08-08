import { Document, model } from 'mongoose';
import expenseSchema from '../schemas/expense';

export interface Expense extends Document {
  title: string;
  description?: string;
  cost: number;
  date?: Date;
}

export interface ExpenseQuery extends Document {
  title?: string;
  description?: string;
  cost?: number;
  date?: Date;
}

const expenseModel = model<Expense>('Expense', expenseSchema);

export default expenseModel;
