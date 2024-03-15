import express from 'express';

const rateRouter = express.Router();
rateRouter.get("/get-rate-list-by-res/:resId");

export default rateRouter;