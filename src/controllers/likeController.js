import { convertOldTime, convertToUserTime } from "../configs/date.js";
import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);

const likeUnlike = async (req, res) => {
  try {
    const { userId, resId, userCountry } = req.body;

    const checkUser = await initModel.users.findByPk(userId);

    const checkRes = await initModel.restaurants.findByPk(resId);

    const existingLike = await initModel.like_res.findOne({
      where: {
        user_id: userId,
        res_id: resId,
      },
      include: ["user", "re"],
    });

    if (!checkUser) {
      return responseData(res, 404, "You are not logged in");
    }

    if (!checkRes) {
      return responseData(res, 404, "The restaurant does not exist");
    }

    let formattedLikes = {};

    const isoDateLike = convertToUserTime(userCountry);

    if (existingLike) {
      if (existingLike.is_like == 1) {
        await existingLike.update({ date_like: isoDateLike, is_like: 0 });
      } else {
        await existingLike.update({ date_like: isoDateLike, is_like: 1 });
        // await existingLike.destroy();
      }
      formattedLikes = {
        likeId: existingLike.like_res_id,
        isLiked: existingLike.is_like,
        dateLike: isoDateLike,
        user: {
          id: existingLike.user.user_id,
          name: existingLike.user.full_name,
          email: existingLike.user.email,
        },
        res: {
          id: existingLike.re.res_id,
          name: existingLike.re.res_name,
          image: existingLike.re.image,
          description: existingLike.re.description,
        },
      };
    } else {
      const newLike = await initModel.like_res.create({
        user_id: userId,
        res_id: resId,
        date_like: isoDateLike,
        is_like: 1,
      });
      const relationship = await initModel.like_res.findByPk(
        newLike.like_res_id,
        {
          include: ["user", "re"],
        }
      );
      formattedLikes = {
        likeId: relationship.like_res_id,
        isLiked: relationship.is_like,
        dateLike: isoDateLike,
        user: {
          id: relationship.user.user_id,
          name: relationship.user.full_name,
          email: relationship.user.email,
        },
        res: {
          id: relationship.re.user_id,
          name: relationship.re.res_name,
          image: relationship.re.image,
          description: relationship.re.description,
        },
      };
    }

    return responseData(
      res,
      200,
      "Processed successfully",
      formattedLikes,
      userCountry
    );
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getLikeListByRes = async (req, res) => {
  try {
    const { resId } = req.params;
    const existingRes = await initModel.restaurants.findByPk(resId);
    if (!existingRes) {
      return responseData(res, 400, "The restaurant does not exist");
    }
    const likeList = await initModel.like_res.findAll({
      include: ["user", "re"],
      where: {
        res_id: resId,
      },
    });
    const formattedLikes = likeList.map((like) => ({
      resId: like.res_id,
      dateLike: convertOldTime(like.date_like),
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

    const existingUser = await initModel.users.findByPk(userId);

    if (!existingUser) {
      return responseData(res, 400, "You are not logged in");
    }
    const likeList = await initModel.like_res.findAll({
      include: ["user", "re"],
      where: {
        user_id: userId,
      },
    });

    const formattedLikes = likeList.map((like) => ({
      userId: like.user_id,
      dateLike: convertOldTime(like.date_like),
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
