import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import {
  getSpotifyAccessToken,
  getUserIdFromTokenId,
} from 'services/firebase.server'

const API = 'https://api.spotify.com/v1'

export type ApiPlaylistItemResult = {
  uri?: string
  href?: string
  id?: string
  description?: string
  images?: Array<{ url?: string }>
  name?: string
  owner?: { display_name?: string; id: string }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, playlistId } = req.query

  if (!token) {
    res.status(400).json({ error: 'Missing `token` value' })
    return
  }

  if (!playlistId) {
    res.status(400).json({ error: 'Missing `playlistId` value' })
    return
  }

  /**
   * Firebase part
   */
  const userUid = await getUserIdFromTokenId(token as string)
  const { accessToken } = await getSpotifyAccessToken(userUid)

  /**
   * Spotify
   */
  axios
    .get<ApiPlaylistItemResult>(`${API}/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .catch((err) => {
      return res
        .status(err.response.status)
        .json({ error: err.response.statusText })
    })
    .then((dataFromApi) => {
      if (dataFromApi) {
        const result: ApiPlaylistItemResult = dataFromApi.data

        res.status(200).json(result)
        return
      }
    })
}
