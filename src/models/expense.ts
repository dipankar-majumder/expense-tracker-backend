import { Document, model } from 'mongoose';
import expenseSchema from '../schemas/expense';

export interface IExpense extends Document {
  title: string;
  description?: string;
  cost: number;
  date?: Date;
  user: string;
}

export interface IExpenseQuery extends Document {
  title?: string;
  description?: string;
  cost?: number;
  date?: Date;
  user?: string;
}

const expenseModel = model<IExpense>('Expense', expenseSchema);

export default expenseModel;
