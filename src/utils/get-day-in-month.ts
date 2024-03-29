import dayjs from 'dayjs'

export function getDaysInMonthArray(currentDate: dayjs.Dayjs): dayjs.Dayjs[] {
  const daysInMonthArray: dayjs.Dayjs[] = Array.from({
    length: currentDate.daysInMonth(),
  }).map((_, index) => {
    return currentDate.set('date', index + 1)
  })

  return daysInMonthArray
}
