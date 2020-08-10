import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userModel from '../models/user';

const userController = {
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
      const encryptedPassword = await bcrypt.hash(password, 10);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = await (
          await userModel.create({
            name,
            email,
            password: encryptedPassword,
          })
        ).toObject();
        res.status(201).json({ user: { ...result } });
      } catch (err) {
        next({ status: 500, message: err.message });
      }
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
    const { email, password } = req.body;
    try {
      const user = (await userModel.findOne({ email }))?.toObject();
      if (!user) {
        throw new Error('E-mail not registered');
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw Error("Password don't matched");
      }
      const token = jwt.sign(
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
      res.status(200).json({ token });
    } catch (err) {
      next({ status: 401, errorType: '', message: err.message });
    }
  },
  get: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.user);
  },
};

export default userController;
