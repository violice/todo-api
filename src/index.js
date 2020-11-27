import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { queryParser } from 'express-query-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import env from 'dotenv';

import jwt from './middlewares/jwt';
import routes from './routes';
import cors from './cors';

env.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(queryParser({
  parseNull: true,
  parseBoolean: true,
}));
app.use(cookieParser());
app.use(cors);
app.use(jwt);

if (process.env !== 'production') {
  app.use(morgan(process.env.MORGAN_TEMPLATE));
}

const router = express.Router();
router.use('/api', routes);
app.use('/', router);

const server = http.createServer(app);
server.listen(process.env.PORT);
console.log(`--- SERVER IS LISTENING ON PORT ${process.env.PORT} ---`);
