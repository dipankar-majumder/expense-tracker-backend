import { Router } from 'express';

const authRoutes = Router();

authRoutes.get('/signIn');
authRoutes.get('/signUp');

export default authRoutes;
