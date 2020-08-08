import { Router } from 'express';
import expenseController from '../controllers/expenses';

const expensesRoutes = Router();

expensesRoutes.post('/', expenseController.create);

expensesRoutes.get('/', expenseController.get);

expensesRoutes.get('/:id', expenseController.get);

expensesRoutes.patch('/:id', expenseController.update);

expensesRoutes.delete('/:id', expenseController.delete);

export default expensesRoutes;
