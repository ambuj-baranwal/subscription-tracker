import { addDays, addWeeks, addMonths, addYears, subDays, isValid } from 'date-fns';
// import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { ApiError } from "./ApiError.js";

/**
 * Calculates the next renewal date based on frequency
 * @param frequency - Frequency String ('once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly')
 * @param baseDate
 * @returns {Date} - Next renewal date in UTC format
 */
const calculateNextCycleDate = (frequency, baseDate = new Date()) => {
    const date = new Date(baseDate);
    if (!isValid(date)) { throw new ApiError("Invalid base date provided."); }

    switch (frequency) {
        case "once": return date;
        case "daily": return addDays(date, 1);
        case "weekly": return addWeeks(date, 1);
        case "monthly": return addMonths(date, 1);
        case "quarterly": return addMonths(date, 3);
        case "halfYearly": return addMonths(date, 6);
        case "yearly": return addYears(date, 1);
        default: throw new ApiError(400, `Invalid frequency type: ${frequency}`);
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
    // subtract days
    return subDays(date, daysBefore);
}

/*


 * Converts a user's local input string to a UTC Date object
 *
 * Example: User inputs "2024-10-25 09:00" in "Asia/Kolkata".
 *
 *  Result: "2024-10-25T03:30:00.000Z"
 * @param dateString
 * @param timezone
 * @returns {*}

const toStandardDate = (dateString, timezone = "UTC") => {
    try {
        return zonedTimeToUtc(dateString, timezone);
    } catch (error) {
        throw new ApiError(400, `Invalid date format or timezone: ${error.message}`);
    }
};

const formatDateForLocale = (date, timezone = 'UTC', formatStr = 'PPpp') => {
    return formatInTimeZone(date, timezone, formatStr);
}

*/

export {
  calculateNextCycleDate,
  calculateNextReminderTime,
};
