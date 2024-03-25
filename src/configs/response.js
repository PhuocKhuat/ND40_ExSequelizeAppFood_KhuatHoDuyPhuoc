import { userCity } from "../constants/constants.js";
import { convertToUserTime } from "./date.js";

const responseData = (res, status, message, content, userCountry) => {
  res.status(status).json({
    status,
    message,
    content,
    date: !userCountry ? convertToUserTime(userCity) : convertToUserTime(userCountry),
  });
};
export default responseData;
