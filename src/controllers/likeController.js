import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const getLikeList = async (req, res) => {
  const content = await initModel.users.findAll({
    include: [
      {
        attributes: [],
        model: initModel.like_res,
        as: "like_res",
        required: true,
      },
    ],
    group: ["users.user_id"],
  });

  responseData(res, 200, "Processed successfully", { content });
};

const getDisLikeList = async (req, res) => {
  const content = await initModel.users.findAll({
    include: [
      {
        attributes: [],
        model: initModel.like_res,
        as: "like_res",
        required: false,
      },
    ],
    where: {
      "$like_res.user_id$": null,
    },
  });

  responseData(res, 200, "Processed successfully", { content });
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
  const {userId} = req.params;
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
      }
    ],
    where: {
      user_id : userId
    },
    raw: true,
  });

  responseData(res, 200, "Processed successfully", { content });
};

export { getLikeList, getDisLikeList, getLikeListByRes, getLikeListByUser };
