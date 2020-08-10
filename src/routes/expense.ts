import { Router } from 'express';
import expenseController from '../controllers/expense';
import passport from 'passport';

const expenseRoutes = Router();

expenseRoutes.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  expenseController.create,
);

expenseRoutes.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  expenseController.getAll,
);

expenseRoutes.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  expenseController.get,
);

expenseRoutes.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  expenseController.update,
);

expenseRoutes.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  expenseController.delete,
);

export default expenseRoutes;
