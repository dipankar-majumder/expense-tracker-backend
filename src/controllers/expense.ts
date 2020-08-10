import { Request, Response, NextFunction } from 'express';

import expenseModel, { Expense } from '../models/expense';

const expenseController = {
  create: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newExpense = await expenseModel.create({
        ...req.body,
        user: req.user,
      } as Expense);
      res.status(201).json(newExpense);
    } catch (err) {
      next({ status: 500, message: err.message, ...err });
    }
  },
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const expenses = await expenseModel.find({ user: req.user });
      res.status(200).json(expenses);
    } catch (err) {
      next({ status: 500, message: err.message });
    }
  },
  get: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const expense = await expenseModel.findById(id);
      try {
        if (expense === null) {
          throw new Error('Expense Not Found');
        }
        res.status(200).json(expense);
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
      const result = await expenseModel.findByIdAndUpdate(id, updateQuery);
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
      const expenses = await expenseModel.findByIdAndDelete(id);
      try {
        if (expenses === null) {
          throw new Error('Expense Not Found');
        }
        res.status(200).json(expenses);
      } catch (err) {
        next({
          status: 404,
          errorType: 'elementNotFoundError',
          error: {
            message: err.message,
          },
        });
      }
    } catch (err) {
      next({
        status: 500,
        errorType: 'databaseError',
        error: {
          message: err.message,
        },
      });
    }
  },
};

export default expenseController;
