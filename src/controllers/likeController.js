import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const likeUnlike = async (req, res) => {
  try {
    const { userId, resId } = req.body;

    const checkUser = await initModel.users.findOne({
      where: {
        user_id: userId,
      },
    });

    const checkRes = await initModel.restaurants.findOne({
      where: {
        res_id: resId,
      },
    });

    const existingLike = await initModel.like_res.findOne({
      where: {
        user_id: userId,
        res_id: resId,
      },
      include: ["user", "re"],
    });

    if (!checkUser) {
      return responseData(res, 404, "Not found user id");
    }
    if (!checkRes) {
      return responseData(res, 404, "Not found res id");
    }

    let formattedLikes = {};

    if (existingLike) {
      if (existingLike.is_like == 1) {
        await existingLike.update({ date_like: new Date(), is_like: 0 });
      } else {
        await existingLike.update({ date_like: new Date(), is_like: 1 });
        // await existingLike.destroy();
      }
      formattedLikes = {
        likeResId: existingLike.like_res_id,
        isLiked: existingLike.is_like,
        dateLike: existingLike.date_like,
        user: {
          userId: existingLike.user.user_id,
          fullName: existingLike.user.full_name,
          email: existingLike.user.email,
          password: existingLike.user.password,
        },
        res: {
          resId: existingLike.re.user_id,
          resName: existingLike.re.res_name,
          image: existingLike.re.image,
          description: existingLike.re.description,
        },
      };
    } else {
      const newLike = await initModel.like_res.create({
        user_id: userId,
        res_id: resId,
        date_like: new Date(),
        is_like: 1,
      });
      const relationship = await initModel.like_res.findOne({
        where: {
          like_res_id: newLike.like_res_id,
        },
        include: ["user", "re"],
      });
      formattedLikes = {
        likeResId: relationship.like_res_id,
        isLiked: relationship.is_like,
        dateLike: relationship.date_like,
        user: {
          userId: relationship.user.user_id,
          fullName: relationship.user.full_name,
          email: relationship.user.email,
          password: relationship.user.password,
        },
        res: {
          resId: relationship.re.user_id,
          resName: relationship.re.res_name,
          image: relationship.re.image,
          description: relationship.re.description,
        },
      };
    }

    return responseData(res, 200, "Processed successfully", formattedLikes);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getLikeListByRes = async (req, res) => {
  try {
    const { resId } = req.params;
    const existingLike = await initModel.like_res.findOne({
      where: {
        res_id: resId,
      },
    });
    if (!existingLike) {
      return responseData(res, 400, "Not found res Id");
    }
    const likeList = await initModel.like_res.findAll({
      include: ["user", "re"],
      where: {
        res_id: resId,
      },
    });
    const formattedLikes = likeList.map((like) => ({
      resId: like.res_id,
      dateLike: like.date_like,
      isLiked: like.is_like,
      res: {
        resName: like.re.res_name,
        image: like.re.image,
        description: like.re.description,
      },
      user: {
        userId: like.user.user_id,
        fullName: like.user.full_name,
        email: like.user.email,
        password: like.user.password,
      },
    }));
    responseData(res, 200, "Processed successfully", formattedLikes);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getLikeListByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const existingLike = await initModel.like_res.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!existingLike) {
      return responseData(res, 400, "Not found user id");
    }
    const likeList = await initModel.like_res.findAll({
      include: ["user", "re"],
      where: {
        user_id: userId,
      },
    });
    const formattedLikes = likeList.map((like) => ({
      userId: like.user_id,
      dateLike: like.date_like,
      isLiked: like.is_like,
      user: {
        fullName: like.user.full_name,
        email: like.user.email,
        password: like.user.password,
      },
      res: {
        resId: like.re.res_id,
        resName: like.re.res_name,
        image: like.re.image,
        description: like.re.description,
      },
    }));
    responseData(res, 200, "Processed successfully", formattedLikes);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

export { likeUnlike, getLikeListByRes, getLikeListByUser };
