import express from 'express';
import { getDisLikeList, getLikeList, getLikeListByRes, getLikeListByUser } from '../controllers/likeController.js';

const likeRouter = express.Router();
likeRouter.get("/get-like-list", getLikeList);
likeRouter.get("/get-dis-like-list", getDisLikeList);
likeRouter.get("/get-like-list-by-res/:resId", getLikeListByRes);
likeRouter.get("/get-like-list-by-user/:userId", getLikeListByUser);

export default likeRouter;