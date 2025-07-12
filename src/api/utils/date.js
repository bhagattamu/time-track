/**
 * Function to convert dateString to date
 * @param {string} dateString Date in mm/dd/yyyy format
 * @returns {Date} date object
 */
const makeDateFromString = (dateString) => {
  if (dateString) {
    try {
      const [month, day, year] = dateString.split("/");
      // Month is zero indexed
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
};

/**
 * Callback function to sort according to date
 * @param {Date} latest object with date prop
 * @param {Date} current object with date prop
 * @returns latest date
 */
const latestDate = (latest, current) => {
  const latestDate = new Date(latest.time);
  const currentDate = new Date(current.time);
  return currentDate > latestDate ? current : latest;
};

/**
 * Function to get cur date according to timezone
 * @param {string} timeZone Timezone - Australia/Sydney
 * @returns date
 */
const getCurDateWithZeroTime = (timeZone) => {
  const dateString = new Date().toLocaleDateString("en-us", { timeZone });
  const [month, day, year] = dateString.split("/");

  // Month is zero indexed
  return new Date(year, month - 1, day);
};

module.exports = {
  latestDate,
  makeDateFromString,
  getCurDateWithZeroTime,
};
