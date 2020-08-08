import { Router, Response, Request } from 'express';

import expensesRoutes from './expenses';
import authRoutes from './auth';

const router = Router();

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
router.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Hello, REST API! 🙂' }),
);

router.use('/expenses', expensesRoutes);
router.use('/auth', authRoutes);

export default router;
