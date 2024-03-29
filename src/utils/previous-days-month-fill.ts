import dayjs from 'dayjs'

export function previousDaysMonthFill(
  firstWeekDay: number,
  currentDate: dayjs.Dayjs,
): dayjs.Dayjs[] {
  const previousMonthFillArray = Array.from({
    length: firstWeekDay,
  })
    .map((_, index) => {
      return currentDate.subtract(index + 1, 'day')
    })
    .reverse()

  return previousMonthFillArray
}
