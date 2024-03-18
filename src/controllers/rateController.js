import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);
const getRateListByRes = async (req, res) => {
  const { resId } = req.params;
try {
  const existingRateRes = await initModel.rate_res.findOne({
    attributes: ["res_id", "user_id", "amount", "date_rate"],
    where: {
      res_id: resId,
    },
    raw: true,
  });

  if (!existingRateRes) {
    return responseData(res, 400, "Invalid restaurant code");
  }
  const rates = await initModel.rate_res.findAll({
    attributes: ["res_id", "user_id", "amount", "date_rate"],
    include: ["re", "user"],
    where: {
      res_id: resId,
    },
    raw: true,
  });

  const formattedRates = rates.map((rate) => ({
    resId: rate.res_id,
    amount: rate.amount,
    dateRate: rate.date_rate,
    res: {
      resName: rate["re.res_name"],
      image: rate["re.image"],
      description: rate["re.description"],
    },
    user: {
      userId: rate["user.user_id"],
      fullName: rate["user.full_name"],
      email: rate["user.email"],
      password: rate["user.password"],
    },
  }));
  return responseData(res, 200, "Processed successfully", formattedRates);
} catch (error) {
  // console.error("Error retrieving rate list by restaurant:", error);
  return responseData(res, 500, "Error processing request");
}

};
const getRateListByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const existingRateRes = await initModel.rate_res.findOne({
      attributes: ["user_id", "res_id", "amount", "date_rate"],
      where: {
        user_id: userId,
      },
      raw: true,
    });
    if (!existingRateRes) {
      return responseData(res, 400, "Invalid user code");
    }
    const rates = await initModel.rate_res.findAll({
      attributes: ["user_id", "res_id", "amount", "date_rate"],
      where: {
        user_id: userId,
      },
      include: ["re", "user"],
      raw: true,
    });
    const formattedRates = rates.map((rate) => ({
      userId: rate.user_id,
      amount: rate.amount,
      dateRate: rate.date_rate,
      user: {
        fullName: rate["user.full_name"],
        email: rate["user.email"],
        password: rate["user.password"],
      },
      res: {
        resId: rate["re.res_id"],
        resName: rate["re.res_name"],
        image: rate["re.image"],
        description: rate["re.description"],
      },
    }));
    return responseData(res, 200, "Processed successfully", formattedRates);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};
export { getRateListByRes, getRateListByUser };
