import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import userModel, { IUser } from '../models/user';

const authController = {
  signUpValidate: [
    body('name').notEmpty({ ignore_whitespace: true }),
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom(async email => {
        if (await userModel.findOne({ email })) {
          return Promise.reject('E-mail already in use');
        }
        return true;
      }),
    body('password').isLength({ min: 6 }),
    body('passwordConfirmation').custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  signUp: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        errorType: 'validationError',
        errors: errors.array(),
      });
      return;
    }
    const { name, email, password } = req.body;
    try {
      const result = await (
        await userModel.create({ name, email, password })
      ).toObject();
      delete result.password;
      res.status(201).json({ user: { ...result } });
    } catch (err) {
      next({ status: 500, message: err.message });
    }
  },
  signInValidate: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  signIn: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        errorType: 'validationError',
        errors: errors.array(),
      });
      return;
    }
    try {
      if (!req.user) throw Error('Auth Error');
    } catch (err) {
      next({ status: 401, errorType: 'authError', message: err.message });
    }
    const user = req.user as IUser;
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.SECRET as string,
      {
        algorithm: 'HS256',
        subject: `${user._id}`,
        issuer: 'localhost',
        audience: 'localhost',
        expiresIn: '1h',
      },
    );
    const refressToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.SECRET as string,
      {
        algorithm: 'HS256',
        subject: `${user._id}`,
        issuer: 'localhost',
        audience: 'localhost',
        expiresIn: '30d',
      },
    );
    res.status(200).json({ accessToken, refressToken });
  },
  accessTokenValidate: [body('refreshToken').notEmpty()],
  accessToken: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        errorType: 'validationError',
        errors: errors.array(),
      });
      return;
    }
    try {
      if (!req.user) throw Error('Auth Error');
    } catch (err) {
      next({ status: 401, errorType: 'authError', message: err.message });
    }
    const user = req.user as IUser;
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.SECRET as string,
      {
        algorithm: 'HS256',
        subject: `${user._id}`,
        issuer: 'localhost',
        audience: 'localhost',
        expiresIn: '1h',
      },
    );
    res.status(200).json({ accessToken, user: req.user });
  },
};

export default authController;
