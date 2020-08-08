import expenseModel, { Expense, ExpenseQuery } from '../models/expense';

const expenseService = {
  create: async (expense: Expense): Promise<Expense> => {
    const newExpense = new expenseModel(expense);
    return await newExpense.save();
  },
  find: async (id?: string): Promise<Expense | Expense[] | null> => {
    return id ? await expenseModel.findById(id) : await expenseModel.find();
  },
  update: async (
    id: string,
    updateQuery: ExpenseQuery,
  ): Promise<Expense | null> => {
    return await expenseModel.findByIdAndUpdate(id, { ...updateQuery });
  },
  delete: async (id: string): Promise<Expense | null> => {
    return await expenseModel.findByIdAndDelete(id);
  },
};

export default expenseService;
