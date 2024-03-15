import express from 'express';
import likeRouter from './likeRouter.js';
import rateRouter from './rateRouter.js';

const rootRouter = express.Router();
rootRouter.use("/like", likeRouter);
rootRouter.use("/rate", rateRouter);

export default rootRouter;