import moment from "moment";

/**
 * Convert a date to UTC string
 * @param {number} hours hours to be added to current date time
 */
const getDateInUtcString = (hours?: number) => {
    // Get a new date
    const date = new Date();

    // If "hours" is provided, add it to the new date
    if (hours != null) {
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    }

    // Return UTC string of the date
    return date.toUTCString();
};

/**
 * Formatting date
 * @param {string} date unformatted date
 * @param {string} format date format you wish to use (default: "DD MMMM YYYY")
 * @returns formatted date
 */
const formatDate = (date: Date, format = "DD MMMM YYYY") => {
    return moment(date).format(format);
};

export { formatDate, getDateInUtcString };
