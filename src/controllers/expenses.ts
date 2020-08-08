import { Request, Response, NextFunction } from 'express';
import expenseService from '../services/expense';
import { Expense } from '../models/expense';

const expenseController = {
  create: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // const newExpense: Expense = { ...req.body, date: new Date(req.body.date) };
    const newExpense: Expense = { ...req.body };
    try {
      const result = await expenseService.create(newExpense);
      res.status(201).json(result);
    } catch (err) {
      next({ status: 500, message: err.message, ...err });
    }
  },
  get: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const expenses = await expenseService.find(id);
      try {
        if (expenses === null) {
          throw new Error('Expense Not Found');
        }
        res.status(200).json(expenses);
      } catch (err) {
        next({ status: 404, message: err.message });
      }
    } catch (err) {
      next({ status: 500, message: err.message });
    }
  },
  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateQuery } = req.body;
    try {
      const result = await expenseService.update(id, updateQuery);
      res.status(200).json(result);
    } catch (err) {
      next({ status: 500, message: err.message });
    }
  },
  delete: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const expenses = await expenseService.delete(id);
      try {
        if (expenses === null) {
          throw new Error('Expense Not Found');
        }
        res.status(200).json(expenses);
      } catch (err) {
        next({ status: 404, message: err.message });
      }
    } catch (err) {
      next({ status: 500, message: err.message });
    }
  },
};

export default expenseController;
