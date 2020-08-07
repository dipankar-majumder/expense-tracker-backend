import { Router, Response, Request } from 'express';

const router = Router();

router.get('/expenses', (req: Request, res: Response) =>
  res.json({ message: 'Expenses Route' }),
);

router.use('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Hello, REST API! 🙂' }),
);

export default router;
