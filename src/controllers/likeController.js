import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const likeUnlike = async (req, res) => {
  try {
    try {
      const { user_id, res_id } = req.body;
      const existingLike = await initModel.like_res.findOne({
        where: {
          user_id: user_id,
          res_id: res_id,
        },
        include: [
          {
            model: initModel.users,
            as: "user",
            attributes: ["full_name", "email", "password"],
          },
          {
            model: initModel.restaurants,
            as: "re",
            attributes: ["res_name", "image", "description"],
          },
        ],
      });
      if (existingLike) {
        if (existingLike.isLike == 1) {
          await existingLike.update({ date_like: new Date(), isLike: 0 });
        } else {
          await existingLike.update({ date_like: new Date(), isLike: 1 });
          // await existingLike.destroy();
        }
      } else {
        await initModel.like_res.create({
          user_id: user_id,
          res_id: res_id,
          date_like: new Date(),
          isLike: 1,
        });
      }
      return responseData(res, 200, "Processed successfully", existingLike);
    } catch (error) {
      return responseData(res, 400, "Not Found");
    }
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
      isLiked: like.isLike,
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
  const { userId } = req.params;
  const content = await initModel.like_res.findAll({
    attributes: ["user_id", "res_id", "date_like"],
    include: [
      {
        model: initModel.users,
        as: "user",
        attributes: ["full_name", "email", "password"],
      },
      {
        model: initModel.restaurants,
        as: "re",
        attributes: ["res_name", "image", "description"],
      },
    ],
    where: {
      user_id: userId,
    },
    raw: true,
  });

  responseData(res, 200, "Processed successfully", { content });
};

export { likeUnlike, getLikeListByRes, getLikeListByUser };
