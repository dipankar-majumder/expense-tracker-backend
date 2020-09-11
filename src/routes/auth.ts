import { Router } from 'express';
import authController from '../controllers/auth';
import passport from 'passport';

const authRoutes = Router();

authRoutes.post(
  '/signUp',
  authController.signUpValidate,
  authController.signUp,
);

authRoutes.post(
  '/signIn',
  authController.signInValidate,
  passport.authenticate('local', { session: false }),
  authController.signIn,
);

authRoutes.post(
  '/accessToken',
  authController.accessTokenValidate,
  passport.authenticate('jwt', { session: false }),
  authController.accessToken,
);

export default authRoutes;
