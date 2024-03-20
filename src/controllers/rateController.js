import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);

const addRateRes = async (req, res) => {
  const { userId, resId, amount } = req.body;
  const existingUserAndRes = await initModel.rate_res.findOne({
    where: {
      user_id: userId,
      res_id: resId,
    },
  });
  if (existingUserAndRes) {
    if (amount > 5) {
      return responseData(res, 400, "Invalid rating. Rating must be less than 5.");
    }
    await existingUserAndRes.destroy();
    await initModel.rate_res.create({
      user_id: userId,
      res_id: resId,
      amount,
      date_rate: new Date(),
    });
  } else {
    if (amount > 5) {
      return responseData(res, 400, "Invalid rating. Rating must be less than 5.");
    }
    await initModel.rate_res.create({
      user_id: userId,
      res_id: resId,
      amount,
      date_rate: new Date(),
    });
  }
  return responseData(res, 200, "Processed successfully", existingUserAndRes);
};

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
    const rateList = await initModel.rate_res.findAll({
      attributes: ["res_id", "user_id", "amount", "date_rate"],
      include: ["re", "user"],
      where: {
        res_id: resId,
      },
      raw: true,
    });

    const formattedRates = rateList.map((rate) => ({
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
    const rateList = await initModel.rate_res.findAll({
      attributes: ["user_id", "res_id", "amount", "date_rate"],
      where: {
        user_id: userId,
      },
      include: ["re", "user"],
      raw: true,
    });
    const formattedRates = rateList.map((rate) => ({
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
export { getRateListByRes, getRateListByUser, addRateRes };
