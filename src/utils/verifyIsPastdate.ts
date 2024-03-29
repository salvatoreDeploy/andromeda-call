import dayjs from 'dayjs'

export function verifyIsPastDate(date: dayjs.Dayjs) {
  return date.endOf('day').isBefore(new Date())
}
