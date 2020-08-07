import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import { connect } from 'mongoose';

import router from './routes';

config();

const app = express();

(async () => {
  try {
    await connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-uzmim.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log(`MongoDB Successfully connected.`);
  } catch (err) {
    console.log(`MongooseServerSelectionError: ${err.message}`);
  }
})();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//   );
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     return res.status(200).json({});
//   }
//   next();
// });

// app.get('/', (req: Request, res: Response) =>
//   res.status(200).json({ message: 'Hello, Express! 🙂' }),
// );

app.use('/api', router);

interface RouteError {
  status: number;
  message: string;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: RouteError = { status: 404, message: 'Route Not Found' };
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: RouteError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ ...err });
});

export default app;
