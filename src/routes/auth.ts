import { Router } from 'express';
import userController from '../controllers/user';

const authRoutes = Router();

authRoutes.post(
  '/signUp',
  userController.signUpValidate,
  userController.signUp,
);

authRoutes.post(
  '/signIn',
  userController.signInValidate,
  userController.signIn,
);

export default authRoutes;
