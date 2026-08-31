const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const now = () => dayjs();

const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
};

const fromNow = (date) => {
  return dayjs(date).fromNow();
};

const addHours = (hours) => {
  return dayjs().add(hours, 'hour').toDate();
};

const addMinutes = (minutes) => {
  return dayjs().add(minutes, 'minute').toDate();
};

const addDays = (days) => {
  return dayjs().add(days, 'day').toDate();
};

const isExpired = (date) => {
  return dayjs(date).isBefore(dayjs());
};

const toNairobiTime = (date = new Date()) => {
  return dayjs(date).tz('Africa/Nairobi');
};

module.exports = {
  now,
  formatDate,
  fromNow,
  addHours,
  addMinutes,
  addDays,
  isExpired,
  toNairobiTime,
};