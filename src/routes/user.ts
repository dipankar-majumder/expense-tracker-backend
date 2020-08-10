import { Router } from 'express';
import passport from 'passport';

import userController from '../controllers/user';

const userRoutes = Router();

userRoutes.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  userController.get,
);

export default userRoutes;
