import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { OAuth2Client } from 'google-auth-library';

import userModel, { IUserQuery } from '../models/user';

const passportConfig = (): void => {
  // Verify JWT
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
          const user: IUserQuery = (
            await userModel.findById(payload.sub)
          )?.toObject();
          // If user doesn't exists
          if (!user) {
            done(null, false);
            return;
          }
          // Otherwise return user
          delete user.password;
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      },
    ),
  );
  // Verify User Credintials and give JWT
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          // Find the user at given the email
          const user = await userModel.findOne({ email });
          // If user not exists, handle it || the password is not correct
          if (!user || !(await user.validPassword(password))) {
            return done(null, false);
          }
          // Otherwise, return the user
          done(null, user.toObject());
        } catch (err) {
          done(err, false);
        }
      },
    ),
  );
  // Google HTTP OAuth Strategy
  passport.use(
    'google',
    new BearerStrategy(async (token, done) => {
      const client = new OAuth2Client(process.env.CLIENT_ID);
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.CLIENT_ID,
        });
        // console.log(ticket.getAttributes());
        // console.log(ticket.getEnvelope());
        // console.log(ticket.getPayload());
        // console.log(ticket.getUserId());
        const payload = ticket.getPayload();
        done(null, payload);
      } catch (err) {
        done(null, false);
      }
    }),
  );
};

export default passportConfig;
