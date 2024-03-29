import dayjs from 'dayjs'

export function nextDaysMonthFill(
  lastWeekDay: number,
  lastWeekDayInCurrentMonth: dayjs.Dayjs,
): dayjs.Dayjs[] {
  const nextMonthFillArray = Array.from({
    length: 7 - (lastWeekDay + 1),
  }).map((_, index) => {
    return lastWeekDayInCurrentMonth.add(index + 1, 'day')
  })

  return nextMonthFillArray
}
