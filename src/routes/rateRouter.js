import express from 'express';
import { addRateRes, getRateListByRes, getRateListByUser } from '../controllers/rateController.js';

const rateRouter = express.Router();

rateRouter.post("/add-rate-res", addRateRes);
rateRouter.get("/get-rate-list-by-res/:resId", getRateListByRes);
rateRouter.get("/get-rate-list-by-user/:userId", getRateListByUser);

export default rateRouter;