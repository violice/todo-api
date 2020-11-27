import express from 'express';

import authRouter from './auth';
import taskRouter from './task';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/task', taskRouter);

export default apiRouter;
