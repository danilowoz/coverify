import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  await axios.get(`https://api.unsplash.com/photos/${id}/download`, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  res.json({ data: 'Success' })
}
