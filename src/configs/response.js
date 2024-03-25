import convertToUserTime from "./date.js";

const responseData = (res, status, message, content, userCountry) => {
  res.status(status).json({
    status,
    message,
    content,
    date: convertToUserTime(userCountry),
  });
};
export default responseData;
