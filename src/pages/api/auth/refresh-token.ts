import * as querystring from 'querystring'

import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import {
  getSpotifyAccessToken,
  getUserIdFromTokenId,
} from 'services/firebase.server'

const BASE64_TOKEN = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64')

/**
 * Get new access token and save it in Firebase
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query

  const uid = await getUserIdFromTokenId(token as string)
  const { refreshToken } = await getSpotifyAccessToken(uid)

  await axios
    .post<{ access_token: string }>(
      `https://accounts.spotify.com/api/token`,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${BASE64_TOKEN}`,
        },
      }
    )
    .then(async ({ data: { access_token } }) => {
      await admin
        .database()
        .ref(`/spotifyAccessToken/${uid}`)
        .update({ accessToken: access_token, refreshToken })

      res.json({ result: 'success' })
    })
    .catch((err) => {
      res.status(500).json({ error: err.response.statusText })
    })
}
