import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

import {
  getSpotifyAccessToken,
  getUserIdFromTokenId,
} from 'services/firebase.server'

const API = 'https://api.spotify.com/v1'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { token, playlistId, data } = req.body

    if (!token) {
      res.status(400).json({ error: 'Missing `token` value' })
      return
    }

    if (playlistId === undefined) {
      res.status(400).json({ error: 'Missing `playlistId` value' })
      return
    }

    if (data === undefined) {
      res.status(400).json({ error: 'Missing `data` value' })
      return
    }

    /**
     * Firebase part
     */
    const userUid = await getUserIdFromTokenId(token as string)
    const { accessToken } = await getSpotifyAccessToken(userUid)

    try {
      await axios.put(`${API}/playlists/${playlistId}/images`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'image/jpeg',
        },
      })

      res.status(200).json({ result: 'ok' })
      return
    } catch (err) {
      res.status(500).json({ error: err.message })
      return
    }
  }

  res.status(400).json({ error: 'method not supported' })
}
