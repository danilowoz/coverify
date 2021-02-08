import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const API = 'https://api.unsplash.com'
const LIMIT = 50

export type BackgroundImageItem = {
  id?: string
  alt_description?: string
  urls?: Record<'raw' | 'regular' | 'full' | 'small', string>
  color?: string
  width?: number
  height?: number
  user?: {
    name: string
    links: { html: string }
  }
}

export type ApiBackgroundImagesResult = {
  total_pages: number
  results: Array<BackgroundImageItem>
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, query } = req.query

  if (page === undefined) {
    res.status(500).json({ error: 'Missing `page` value' })
    return
  }

  /**
   * UnSplash
   */
  const { data } = await axios.get(`${API}/search/photos`, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_TOKEN}` },
    params: { query, per_page: LIMIT, page: Number(page) ?? 1 },
  })

  res.json(data)
}
