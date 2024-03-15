import express from 'express';
import { getDisLikeList, getLikeList } from '../controllers/likeController.js';

const likeRouter = express.Router();
likeRouter.get("/get-like-list", getLikeList);
likeRouter.get("/get-dis-like-list", getDisLikeList);

export default likeRouter;