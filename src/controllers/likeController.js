import responseData from "../configs/response.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelize);
const getLikeList = async (req, res) => {
  const content = await initModel.like_res.findAll({
    attributes: ['user_id', 'res_id', 'date_like'],
    include: ["user", "re"],
    raw: true,
  });
  
  responseData(res, "Success", 200, {content});
};

const getDisLikeList = async (req, res) => {
  const content = await initModel.users.findAll({
    attributes: ['user_id', 'full_name', 'email', 'password'],
    include: [{
      attributes: ['user_id', 'res_id', 'date_like'],
      model: initModel.like_res,
      as: "like_res",
      required: false,
      where: { user_id: null }, // Điều kiện để kiểm tra không có kết quả tương ứng trong LikeRes
    }],
    raw: true
  });
  
  responseData(res, "Success", 200, {content});
};

export { getLikeList, getDisLikeList }