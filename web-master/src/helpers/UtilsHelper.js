import moment from "moment";
import 'moment/locale/vi';
import _ from "lodash";

moment.locale('vi')

export const getMomentObject = (data, format = "YYYY-MM-DD HH:mm:ss") =>
  data && moment(data, format);
export const getDate = (data, format = "YYYY-MM-DD") =>
  data && moment(data).format(format);
export const getDateFormat = (data, format = "MM/DD/YYYY") =>
  data && moment(data).format(format);
export const getTime = (data, format = "LT") =>
  data && moment(data).format(format);
export const getTimeFull = (data, format = "HH:mm:ss") =>
  data && moment(data).format(format);
export const getTimeByHoursMinutesFm = (data, format = "HH:mm") =>
  data && moment(data).format(format);
export const getDateTime = (data, format = "MM/DD/YYYY hh:mm a") =>
  data && moment(data).format(format);
export const getYearOld = (data, format) =>
  data && moment().diff(moment(data), "year");
export const getDayInCurrentWeek = (day, format = "YYYY-MM-DD") =>
  moment()
    .weekday(day)
    .format(format);
export const getStartOfMonth = (format = "YYYY-MM-DD") =>
  moment()
    .startOf("month")
    .format(format);
export const getEndOfMonth = (format = "YYYY-MM-DD") =>
  moment()
    .endOf("month")
    .format(format);
export const getDayTimeString = (dateTime, format = "YYYY-MM-DD HH:mm:ss") =>
  moment(dateTime).format(format);
export const getTimezone = (dateTime, format = "YYYY-MM-DDTHH:mm:ss") =>
  moment(dateTime).format(format);

export const getTimeUtilNow = (datetime) => {
  return moment(datetime).fromNow()
}

export const uppercaseFirstLetter = (data) =>
  data.charAt(0).toUpperCase() + data.slice(1);

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "");
  });
};

const isArray = function (a) {
  return Array.isArray(a);
};

const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== "function";
};

export const getUserFullName = (user, defaultName = "Other") => {
  if (!user) {
    return defaultName;
  }
  const preferredName = user.preferredName ? `"${user.preferredName}"` : "";
  let fullName = `${preferredName} ${user.firstName || ""} ${user.middleName ||
    ""} ${user.lastName || ""}`
    .trim()
    .replace(/ +(?= )/g, "");
  const fullNameRs = _.isEmpty(fullName) ? defaultName : fullName;

  return fullNameRs;
};

export const getPortalType = () => {
  const hash = window.location.hash;
  if (hash.startsWith("#/admin")) return "admin";

  if (hash.startsWith("#/member")) return "member";
};

export const stripHtml = (content) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = content;
  const textContent = tmp.textContent || tmp.innerText || "";
  return textContent.trim();
};

export const arrayToParams = (array = []) => {
  if (!array) return
  return `key=${array.join("&key=")}`
};

export const urlQueryFromObject = (filters) => {
  if (!_.isObject || _.isNull(filters)) {
    return "";
  }

  for (let key in filters) {
    const value = String(filters[key]);
    if (_.isEmpty(value) || _.isNull(value)) {
      delete filters[key];
    }
  }

  filters = { limit: 100000, offset: 0, ...filters };

  if (!_.isUndefined(filters.desc) && !filters.desc) {
    filters.ordering = `-${filters.ordering}`.replace(/,/g, ",-");
  }

  const searchParams = new URLSearchParams(filters);
  searchParams.delete("desc");
  return "?" + searchParams.toString();
};

export const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

export const isGTENowDay = (current) => {
  var yesterday = moment().subtract(1, "day");
  return current.isAfter(yesterday);
};

export const convertToDecimal = (data, length) => {
  const weight = length ? 10 * length : 1;
  return Math.round(data * weight) / weight;
};

export const getFirstWordOfName = (fullname = "") => {
  return fullname.match(/[A-Z]/g)
};

export const getDurationTime = (startTime, endTime, unit = "hours") => {
  const duration = moment.duration(moment(endTime).diff(moment(startTime)));
  switch (unit) {
    case "days":
      return duration.asDays();
    case "hours":
      return duration.asHours();
    case "minutes":
      return duration.asMinutes();
    default:
      return duration.asMilliseconds();
  }
};

export const fixNumber = (number, amount = 2) => {
  return Number(number).toFixed(amount);
};

export const splitContent = (content, amount = 5) => {
  const splitContent = content
    .split(" ")
    .slice(0, amount)
    .join(" ");
  const showMore = content.split(" ").length > amount ? "..." : "";
  return splitContent.concat(showMore);
};

export const numericCompare = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
}).compare;

// For calendar
export const getMonthName = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
};

export const isSameDay = (date, d) => {
  return (
    date.getFullYear() === d.getFullYear() &&
    date.getMonth() === d.getMonth() &&
    date.getDate() === d.getDate()
  );
};

export const getAPIFiltersByFilters = (filters) => {
  const copyFilters = { ...filters };
  const result = {
    limit: copyFilters.pageSize,
    offset: (copyFilters.current - 1) * copyFilters.pageSize,
  };
  delete copyFilters.pageSize;
  delete copyFilters.current;
  delete copyFilters.total;
  return {
    ...result,
    ...copyFilters,
  };
};

export const getPrice = (price) => {
  return parseInt(price).toLocaleString('vi', {
    style: 'currency',
    currency: 'VND',
  })
}