require('dotenv').config()

import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios'

export default async (req: NowRequest, res: NowResponse) => {
  const query = req.query.query

  const data = await axios.get('https://api.unsplash.com/search/photos', {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_TOKEN}` },
    // eslint-disable-next-line @typescript-eslint/camelcase
    params: { query, per_page: 50 },
  })

  const dataPageTwo = await axios.get(
    'https://api.unsplash.com/search/photos',
    {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_TOKEN}` },
      // eslint-disable-next-line @typescript-eslint/camelcase
      params: { query, page: 2, per_page: 50 },
    }
  )

  const mixedData = [...data.data.results, ...dataPageTwo.data.results]

  res.json({ data: mixedData })
}
