import {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    subDays,
    isValid,
    format,
} from "date-fns";
import { ApiError } from "./ApiError.js";

/**
 * Calculates the next renewal date based on frequency
 * @param frequency - Frequency String ('once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly')
 * @param baseDate
 * @returns {Date} - Next renewal date in UTC format
 */
const calculateNextPaymentDate = (frequency, baseDate = new Date()) => {
    const date = new Date(baseDate);

    switch (frequency) {
        case "once":
            return date;
        case "daily":
            return addDays(date, 1);
        case "weekly":
            return addWeeks(date, 1);
        case "monthly":
            return addMonths(date, 1);
        case "quarterly":
            return addMonths(date, 3);
        case "halfYearly":
            return addMonths(date, 6);
        case "yearly":
            return addYears(date, 1);
        default:
            throw new ApiError(400, `Invalid frequency type: ${frequency}`);
    }
}

/**
 *
 * @param renewalDate
 * @param daysBefore
 * @returns {Date}
 */
const calculateNextReminderTime = (renewalDate, daysBefore) => {
    const date = new Date(renewalDate);
    if (!isValid(date)) {throw new ApiError(400, `Invalid reminder date: ${date}`);}
    return subDays(date, daysBefore);
}


/**
 * Formats a Date object for human consumption (with timezone awareness)
 * @param {Date} date - Date to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.formatStr='default'] - Format type (see below)
 * @param {string} [options.timezone='local'] - Timezone ('local' or 'utc')
 * @returns {string} Human-readable date string
 * @throws {ApiError} For invalid date or format
 */
const formatDate = (date, { timezone = "local", formatStr = "default" } = {}) => {
  const locale = "en-US";
  const options = {
    timezone: timezone === "local" ? undefined : "UTC",
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  if (formatStr === "UTC") { return date.toUTCString() }
  if (formatStr === "ISO8601") { return date.toISOString() }

  return new Intl.DateTimeFormat(locale, options).format(date);
};


const timeZones = {
  IST: "UTC+5:30",
};

const formatted = formatDate(new Date(), {
  timezone: timeZones["IST"],
  format: "default",
});

export {
  calculateNextPaymentDate,
  calculateNextReminderTime,
  addDays,
  formatDate,
};
