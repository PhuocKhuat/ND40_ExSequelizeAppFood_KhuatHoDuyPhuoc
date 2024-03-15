import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";
import sequelize from 'sequelize';

const initModel = initModels(sequelizeConnect);
const {Op} = sequelize;
const getLikeList = async (req, res) => {
  const content = await initModel.users.findAll({
    include: [{
      attributes: [],
      model: initModel.like_res,
      as: "like_res",
      required: true,
    }],
    group: ['users.user_id'],
  });
  
  responseData(res, 200, "Processed successfully", {content});
};

const getDisLikeList = async (req, res) => {
  const content = await initModel.users.findAll({
    include: [{
      attributes: [],
      model: initModel.like_res,
      as: "like_res",
      required: false,
    }],
    where: {
      '$like_res.user_id$': null 
    },
    raw: true
  });
  
  responseData(res, 200, "Processed successfully", {content});
};

export { getLikeList, getDisLikeList }