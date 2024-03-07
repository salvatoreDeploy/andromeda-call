import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number().min(0).max(6),
      startTimeInMinute: z.number(),
      endTimeInMinute: z.number(),
    }),
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
    intervals.map(() => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: 1,
          time_start_in_minutes: 400,
          time_end_in_minutes: 566,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
