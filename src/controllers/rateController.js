import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const getRateListByRes = async (req, res) => {
  const { resId } = req.params;
  try {
    const existingRateRes = await initModel.rate_res.findOne({
      attributes: ["res_id", "user_id", "date_rate"],
      where: {
        res_id: resId,
      },
      raw: true,
    });
    if (!existingRateRes) {
      responseData(res, 400, "Invalid restaurant code");
      return;
    }
    const rates = await initModel.rate_res.findAll({
      attributes: ["res_id", "user_id", "date_rate"],
      include: ["re", "user"],
      where: {
        res_id: resId,
      },
      raw: true,
    });
    // Thực hiện format lại dữ liệu trước khi gửi phản hồi
    const formattedRates = rates.map((rate) => ({
      res_id: rate.res_id,
      date_rate: rate.date_rate,
      re: {
        res_name: rate["re.res_name"],
        image: rate["re.image"],
        description: rate["re.description"],
      },
      user: {
        user_id: rate["user.user_id"],
        full_name: rate["user.full_name"],
        email: rate["user.email"],
        password: rate["user.password"],
      },
    }));

    responseData(res, 200, "Processed successfully", {
      content: formattedRates,
    });
  } catch (error) {
    // console.error("Error retrieving rate list by restaurant:", error);
    responseData(res, 500, "Error processing request");
  }
};
const getRateListByUser = async (req, res) => {
  const { resId } = req.params;
  try {
    const existingRateRes = await initModel.rate_res.findOne({
      attributes: ["res_id", "user_id", "date_rate"],
      where: {
        user_id: resId,
      },
      raw: true,
    });
    if (!existingRateRes) {
      responseData(res, 400, "Invalid restaurant code");
      return;
    }
    const rates = await initModel.rate_res.findAll({
      attributes: ["res_id", "user_id", "date_rate"],
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
    // Thực hiện format lại dữ liệu trước khi gửi phản hồi
    const formattedRates = rates.map((rate) => ({
      res_id: rate.res_id,
      date_rate: rate.date_rate,
      re: {
        res_name: rate["re.res_name"],
        image: rate["re.image"],
        description: rate["re.description"],
      },
      user: {
        full_name: rate["user.full_name"],
        email: rate["user.email"],
        password: rate["user.password"],
      },
    }));

    responseData(res, 200, "Processed successfully", {
      content: formattedRates,
    });
  } catch (error) {
    // console.error("Error retrieving rate list by restaurant:", error);
    responseData(res, 500, "Error processing request");
  }
};
export { getRateListByRes, getRateListByUser };
