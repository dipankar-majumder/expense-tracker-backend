import { Request, Response } from 'express';

const userController = {
  get: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.user);
  },
};

export default userController;
