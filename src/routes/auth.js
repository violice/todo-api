import express from 'express';

import { auth } from 'controllers/auth';

const authRouter = express.Router();

authRouter.post('/', auth);

export default authRouter;
