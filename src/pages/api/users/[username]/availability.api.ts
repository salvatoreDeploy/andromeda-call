/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import dayjs from 'dayjs'
import { verifyIsPastDate } from '../../../../utils/verifyIsPastdate'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = verifyIsPastDate(referenceDate)

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  // Time interval

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // 10 horas de inicio
  const endHour = time_end_in_minutes / 60 // 18 horas de fim

  // Criar um array dessa forma = [10, 11, 12, 13, 14, 15, 16, 17]

  // Horarios possiveis cadastrados

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index
    },
  )

  // Horarios indisponivel

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTimes) => blockedTimes.date.getHours() === time,
    )

    const isPastTime = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isPastTime
  })

  return res.json({ possibleTimes, availableTimes })
}
