import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import passportConfig from './middlewares/passport';

import routes from './routes';

console.clear();
config();
passportConfig();

const app = express();

(async () => {
  try {
    (
      await connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-uzmim.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
      )
    ).set('debug', true);
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

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: { title: 'Hello World', version: '0.0.1' },
    basePath: '/',
    openapi: '3.0.0',
  },
  // Path to the API docs
  apis: ['./src/routes/*.ts'],
});

app.get('/api-docs.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Hello, Express! 🙂' }),
);

app.use('/api', routes);

export interface IRouteError {
  status: number;
  message: string;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IRouteError = { status: 404, message: 'Route Not Found' };
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: IRouteError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ ...err, status: err.status || 500 });
});

export default app;
