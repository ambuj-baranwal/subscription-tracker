import { ApiError } from "./ApiError.js";

/**
 * Calculates the next renewal date based on frequency
 * @param {String} frequency - Frequency String ('once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly')
 * @returns {Date} Next renewal date in UTC format
 * @throws {ApiError} For invalid frequency
 */
const calculateSendDate = (frequency) => {
  const now = new Date();
  const renewalDate = new Date(now);
  const frequencyMap = {
    once: 30,
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    halfYearly: 182,
    yearly: 365,
  };

  switch (frequency) {
    case "once":
      renewalDate.setUTCFullYear(
        renewalDate.getUTCFullYear() + frequencyMap[frequency]
      );
      break;
    case "daily":
      renewalDate.setUTCDate(
        renewalDate.getUTCDate() + frequencyMap[frequency]
      );
      break;
    case "weekly":
      renewalDate.setUTCDate(
        renewalDate.getUTCDate() + frequencyMap[frequency]
      );
      break;
    case "monthly":
      renewalDate.setUTCMonth(
        renewalDate.getUTCMonth() + frequencyMap[frequency]
      );
      break;
    case "halfYearly":
      renewalDate.setUTCFullYear(
        renewalDate.getUTCFullYear() + frequencyMap[frequency]
      );
      break;
    case "yearly":
      renewalDate.setUTCFullYear(
        renewalDate.getUTCFullYear() + frequencyMap[frequency]
      );
      break;
    default:
      throw new ApiError(400, `Invalid frequency type: ${frequency}`);
  }

  return renewalDate;
};

/**
 * Creates a new Date object from UTC time (critical for subscription reminders)
 * @param {number} [year=1970] - Year (default: 1970)
 * @param {number} [month=0] - Month (0-indexed, Jan=0)
 * @param {number} [day=1] - Day of the month
 * @param {number} [hours=0] - Hours (0-23)
 * @param {number} [minutes=0] - Minutes (0-59)
 * @param {number} [seconds=0] - Seconds (0-59)
 * @returns {Date} Valid UTC Date object
 * @throws {ApiError} For invalid date parts
 */
const createDate = (
  year = 1970,
  month = 0,
  day = 1,
  hours = 0,
  minutes = 0,
  seconds = 0
) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(hours, minutes, seconds);
  return date;
};

/**
 * Adds time to a date (using UTC to avoid timezone issues)
 * @param {Date} baseDate - Date to add time to
 * @param {number} [days=30] - Days to add (default: 30)
 * @param {number} [minutes=60] - Minutes to add (default: 60)
 * @param {number} [hours=24] - Hours to add (default: 24)
 * @param {number} [seconds=60] - Seconds to add (default: 60)
 * @returns {Date} New UTC date
 * @throws {ApiError} If baseDate is invalid
 */
const addDays = (
  baseDate,
  days = 30,
  hours = 24,
  minutes = 60,
  seconds = 60
) => {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(date.getUTCHours() + hours);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  date.setUTCSeconds(date.getUTCSeconds() + seconds);
  return date;
};

/**
 * Formats a Date object for human consumption (with timezone awareness)
 * @param {Date} date - Date to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.format='default'] - Format type (see below)
 * @param {string} [options.timezone='local'] - Timezone ('local' or 'utc')
 * @returns {string} Human-readable date string
 * @throws {ApiError} For invalid date or format
 */
const formatDate = (date, { timezone = "local", format = "default" } = {}) => {
  const locale = "en-US";
  const options = {
    timezone: timezone === "local" ? undefined : "UTC",
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hours: "2-digit",
    minutes: "2-digit",
    seconds: "2-digit",
  };
  if (format === "UTC") {
    return date.toUTCString();
  }
  if (format === "ISO8601") {
    return date.toISOString();
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Parses a string into a Date object (with validation)
 * @param {string} dateString - Date string to parse
 * @param {string} [format='YYYY-MM-DD'] - Date format
 * @returns {Date} Valid Date object
 * @throws {ApiError} For invalid date strings
 */
const parseDate = (dateString, format = "YYYY-MM-DD") => {
  // Handle ISO 8601 strings first (most common)
  if (
    dateString.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/)
  ) {
    return new Date(dateString);
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ApiError(400, `Invalid date string format : ${dateString}`);
  }

  return date;
};

const getSubscriptionRemindTime = (subscriptionDate, reminderInterval) => {
  return addDays(new Date(subscriptionDate), reminderInterval);
};

const timeZones = {
  IST: "UTC+5:30",
};

const formatted = formatDate(new Date(), {
  timezone: timeZones["IST"],
  format: "default",
});

export {
  calculateSendDate,
  createDate,
  addDays,
  formatDate,
  parseDate,
  getSubscriptionRemindTime,
};
