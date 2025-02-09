import { DateTime } from "luxon";

export const formatDateTime = (dateTimeString: string, timezone = "local") => {
  return DateTime.fromISO(dateTimeString)
    .setZone(timezone)
    .toFormat("yyyy. MM. dd HH:mm:ss");
};
