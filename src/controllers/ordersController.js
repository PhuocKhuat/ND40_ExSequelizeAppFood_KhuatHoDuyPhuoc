import responseData from "../configs/response.js";
import sequelizeConnect from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(sequelizeConnect);

const addOrders = async (req, res) => {
  try {
    const { userId, foodId, amount, code, arrSubId } = req.body;

    const existingUserId = await initModel.users.findByPk(userId);
    const existingFoodId = await initModel.foods.findByPk(foodId);

    if (!existingUserId) {
      return responseData(res, 404, "User not found", "");
    }

    if (!existingFoodId) {
      return responseData(res, 404, "Food not found", "");
    }

    const newOrder = await initModel.orders.create({
      user_id: userId,
      food_id: foodId,
      amount,
      code,
      arr_sub_id: arrSubId,
    });

    const addedOrder = await initModel.orders.findOne({
      where: { orders_id: newOrder.orders_id },
      include: [
        {
          model: initModel.users,
          as: "user",
          attributes: ["full_name", "email", "password"],
        },
        {
          model: initModel.foods,
          as: "food",
          attributes: ["food_name", "image", "price", "description"],
        },
      ],
    });

    const formattedOrders = {
      orderId: addedOrder.orders_id,
      amount: addedOrder.amount,
      code: addedOrder.code,
      arrSubId: addedOrder.arr_sub_id,
      user: {
        userId: addedOrder.user.user_id,
        fullName: addedOrder.user.full_name,
        email: addedOrder.user.email,
        password: addedOrder.user.password,
      },
      food: {
        userId: addedOrder.food.food_id,
        fullName: addedOrder.food.food_name,
        image: addedOrder.food.image,
        password: addedOrder.food.price,
        description: addedOrder.food.description,
      },
    };
    return responseData(res, 200, "Processed successfully", formattedOrders);
  } catch (error) {
    return responseData(res, 500, "Error processing request", "");
  }
};

export default addOrders;
