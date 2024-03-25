import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const convertToUserTime = (userCountry) =>
  dayjs.tz(new Date(), userCountry).format("YYYY-MM-DD HH:mm:ss");

export default convertToUserTime;
