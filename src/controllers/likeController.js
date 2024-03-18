import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const likeUnlike = async (req, res) => {
  try {
    const { user_id, res_id } = req.body;
    const existingLike = await initModel.like_res.findOne({
      where: {
        user_id: user_id,
        res_id: res_id,
      },
    });
    if (existingLike) {
      if (existingLike.isLike == 1) {
        await existingLike.update({ date_like: new Date(), isLike: 0 });
      } else{
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
    return responseData(res, 200, "Processed successfully");
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getLikeListByRes = async (req, res) => {
  const { resId } = req.params;
  const content = await initModel.like_res.findAll({
    attributes: ["res_id", "user_id", "date_like"],
    include: [
      {
        model: initModel.restaurants,
        as: "re",
        attributes: ["res_name", "image", "description"],
      },
      {
        model: initModel.users,
        as: "user",
        attributes: ["full_name", "email", "password"],
      },
    ],
    where: {
      res_id: resId,
    },
    raw: true,
  });
  responseData(res, 200, "Processed successfully", { content });
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
