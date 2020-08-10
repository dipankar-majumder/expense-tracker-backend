import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import userModel from '../models/user';

const passportConfig = (): void => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: `${process.env.SECRET}`,
        algorithms: ['HS256'],
        issuer: 'localhost',
        audience: 'localhost',
      },
      async (payload, done) => {
        try {
          // Find the user specified in token
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...user } = (
            await userModel.findById(payload.sub)
          )?.toObject();
          // If user doesn't exists
          if (!user) {
            done(null, false);
            return;
          }
          // Otherwise return user
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      },
    ),
  );
};

export default passportConfig;
