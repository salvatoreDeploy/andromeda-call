import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './style'
import { getWeekDays } from '../../utils/get-week-days'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { getDaysInMonthArray } from '../../utils/get-day-in-month'
import { previousDaysMonthFill } from '../../utils/previous-days-month-fill'
import { nextDaysMonthFill } from '../../utils/next-days-month-fill'
import { Text, Tooltip } from '@chain-reaction-ui/react'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export default function Calendar({
  onDateSelected,
  /* selectedDate, */
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  const username = String(router.query.username)

  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipDate, setTooltipDate] = useState('')

  const handleMouseEnter = (date: dayjs.Dayjs) => {
    setTooltipDate(String(date.toDate()))
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonth)
  }

  function handleNextMonth() {
    const previousMonth = currentDate.add(1, 'month')

    setCurrentDate(previousMonth)
  }

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blockedDates',
      currentDate.get('year'),
      currentDate.get('month'),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: (currentDate.get('month') + 1).toString().padStart(2, '0'),
        },
      })
      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const dayInMonth = getDaysInMonthArray(currentDate)

    const firstWeekDay = currentDate.get('day')

    const previousDayMonth = previousDaysMonthFill(firstWeekDay, currentDate)

    const lastWeekDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastWeekDayInCurrentMonth.get('day')

    const nextDayMonth = nextDaysMonthFill(
      lastWeekDay,
      lastWeekDayInCurrentMonth,
    )

    const calendarDays = [
      ...previousDayMonth.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
      ...dayInMonth.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextDayMonth.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  const shortWeekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekday) => (
              <th key={weekday}>{weekday}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <div
                        onMouseEnter={() => handleMouseEnter(date)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <CalendarDay
                          disabled={disabled}
                          onClick={() => onDateSelected(date.toDate())}
                        >
                          {showTooltip &&
                            tooltipDate === String(date.toDate()) && (
                              <Tooltip
                                content={
                                  tooltipDate === String(date.toDate())
                                    ? `${capitalizeFirstLetter(date.format('DD [de] MMMM'))} - ${disabled ? 'Indisponivel' : 'Disponivel'}`
                                    : ''
                                }
                                open={tooltipDate === String(date.toDate())}
                              >
                                <Text></Text>
                              </Tooltip>
                            )}
                          {date.get('date')}
                        </CalendarDay>
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
