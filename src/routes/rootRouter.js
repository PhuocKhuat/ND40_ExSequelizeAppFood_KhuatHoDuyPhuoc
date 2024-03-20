import express from 'express';
import likeRouter from './likeRouter.js';
import rateRouter from './rateRouter.js';
import ordersRouter from './ordersRouter.js';

const rootRouter = express.Router();
rootRouter.use("/like", likeRouter);
rootRouter.use("/rate", rateRouter);
rootRouter.use("/orders", ordersRouter);

export default rootRouter;