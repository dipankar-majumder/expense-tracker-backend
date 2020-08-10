import { Router, Response, Request } from 'express';

import expenseRoutes from './expense';
import authRoutes from './auth';
import userRoutes from './user';

const routes = Router();

/**
 * @swagger
 * /api/:
 *   get:
 *     description: Returns users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: response Hello, World!
 *         schema:
 *           type: object
 */
routes.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Hello, REST API! 🙂' }),
);

routes.use('/expenses', expenseRoutes);

routes.use('/auth', authRoutes);

routes.use('/user', userRoutes);

export default routes;
