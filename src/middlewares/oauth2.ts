import { OAuth2Client } from 'google-auth-library';
import { NextFunction, Request, Response } from 'express';

const OAuth2 = {
  google: (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];
    const client = new OAuth2Client(process.env.CLIENT_ID);
    (async () => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token as string,
          audience: process.env.CLIENT_ID,
        });
        // console.log(ticket.getAttributes());
        // console.log(ticket.getEnvelope());
        // console.log(ticket.getPayload());
        // console.log(ticket.getUserId());
        const payload = ticket.getPayload();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (payload !== undefined) {
          req.user = {
            issuer: payload.iss,
            userId: payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified,
            name: payload.name,
            picture: payload.picture,
          };
          next(null);
          res.json({ payload });
        } else {
          throw Error('Invalid or Expired Token');
        }
      } catch (err) {
        res.sendStatus(401);
      }
    })();
  },
};

export default OAuth2;
