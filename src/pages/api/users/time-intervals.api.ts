/* eslint-disable prettier/prettier */
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        startTimeInMinute: z.number(),
        endTimeInMinute: z.number(),
      }),
  )
    .refine((intervals) => intervals.length > 0, {
      message: 'Voce precisa selecionar pelo menos um dia da semana',
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinute - 60 >= interval.startTimeInMinute,
        )
      },
      {
        message:
          'O horario de termino deve ser pelo menos uma hora de distancia de inicio',
      },
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  // Ao criar o banco de daos sql para poder usar o createMany()

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinute,
          time_end_in_minutes: interval.endTimeInMinute,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
