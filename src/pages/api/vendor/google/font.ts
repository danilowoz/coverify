import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'

import {
  getSpotifyAccessToken,
  getUserIdFromTokenId,
} from 'services/firebase.server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query

  if (!token) {
    res.status(400).json({ error: 'Missing `token` value' })
    return
  }

  /**
   * Firebase part
   */
  const userUid = await getUserIdFromTokenId(token as string)
  await getSpotifyAccessToken(userUid)

  google
    .webfonts('v1')
    .webfonts.list({
      sort: 'POPULARITY',
      auth: process.env.GOOGLE_API_KEY,
    })
    .then((response) => {
      res.status(200).json(response.data.items?.slice(0, 70))
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}
