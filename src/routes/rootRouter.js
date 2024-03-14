import express from 'express';
import likeRouter from './likeRouter.js';

const rootRouter = express.Router();
rootRouter.use("/like", likeRouter);

export default rootRouter;