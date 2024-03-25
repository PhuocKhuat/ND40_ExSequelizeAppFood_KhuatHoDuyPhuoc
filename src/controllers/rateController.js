
import { convertOldTime, convertToUserTime } from "../configs/date.js";
import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);

const addRateRes = async (req, res) => {
  try {
    const { userId, resId, amount, userCountry } = req.body;

    const checkUser = await initModel.users.findByPk(userId);

    const checkRes = await initModel.restaurants.findByPk(resId);

    const exitstingRateRes = await initModel.rate_res.findOne({
      where: {
        user_id: userId,
        res_id: resId,
      },
      include: ["user", "re"],
    });

    let formattedRates = {};

    const isoDateRate = convertToUserTime(userCountry);

    if (!checkUser) {
      return responseData(res, 404, "You are not logged in");
    }

    if (!checkRes) {
      return responseData(res, 404, "The restaurant does not exist");
    }

    if (exitstingRateRes) {
      if (amount > 5) {
        return responseData(
          res,
          400,
          "Invalid rating. Rating must be less than 5."
        );
      }
      await exitstingRateRes.update({ amount, date_rate: new Date() });

      formattedRates = {
        rateId: exitstingRateRes.rate_res_id,
        amount: exitstingRateRes.amount,
        dateRate: isoDateRate,
        user: {
          id: exitstingRateRes.user.user_id,
          name: exitstingRateRes.user.full_name,
          email: exitstingRateRes.user.email,
        },
        res: {
          id: exitstingRateRes.re.res_id,
          name: exitstingRateRes.re.res_name,
          image: exitstingRateRes.re.image,
          description: exitstingRateRes.re.description,
        },
      };
    } else {
      if (amount > 5) {
        return responseData(
          res,
          400,
          "Invalid rating. Rating must be less than 5."
        );
      }
      const newRate = await initModel.rate_res.create({
        user_id: userId,
        res_id: resId,
        amount,
        date_rate: isoDateRate,
      });

      const relationship = await initModel.rate_res.findByPk(
        newRate.rate_res_id,
        {
          include: ["user", "re"],
        }
      );

      formattedRates = {
        rateId: relationship.rate_res_id,
        amount: relationship.amount,
        dateRate: isoDateRate,
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
      formattedRates,
      userCountry
    );
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getRateListByRes = async (req, res) => {
  const { resId } = req.params;
  try {
    const existingRateRes = await initModel.rate_res.findOne({
      where: {
        res_id: resId,
      },
      raw: true,
    });

    if (!existingRateRes) {
      return responseData(res, 400, "Invalid restaurant code");
    }
    const rateList = await initModel.rate_res.findAll({
      include: ["re", "user"],
      where: {
        res_id: resId,
      },
      raw: true,
    });

    const formattedRates = rateList.map((rate) => ({
      resId: rate.res_id,
      amount: rate.amount,
      dateRate: convertOldTime(rate.date_rate),
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
      where: {
        user_id: userId,
      },
      raw: true,
    });
    if (!existingRateRes) {
      return responseData(res, 400, "Invalid user code");
    }
    const rateList = await initModel.rate_res.findAll({
      where: {
        user_id: userId,
      },
      include: ["re", "user"],
      raw: true,
    });
    const formattedRates = rateList.map((rate) => ({
      userId: rate.user_id,
      amount: rate.amount,
      dateRate: convertOldTime(rate.date_rate),
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
