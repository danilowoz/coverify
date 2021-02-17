import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import {
  getSpotifyAccessToken,
  getUserIdFromTokenId,
} from 'services/firebase.server'
import { encrypt } from 'common/utils/encrypt'

const API = 'https://api.spotify.com/v1'

export type ApiPlaylistResult = {
  limit: number
  offset: number
  total: number
  items: Array<{
    uri?: string
    href?: string
    id?: string
    description?: string
    images?: Array<{ url?: string }>
    name?: string
    owner?: { display_name?: string; id: string }
  }>
}

const LIMIT = 15

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, offset } = req.query

  if (!token) {
    res.status(400).json({ error: 'Missing `token` value' })
    return
  }

  if (offset === undefined) {
    res.status(400).json({ error: 'Missing `offset` value' })
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
  try {
    const dataFromApi = await axios.get<ApiPlaylistResult>(
      `${API}/me/playlists`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: LIMIT, offset: offset ?? 0 },
      }
    )

    if (dataFromApi) {
      const result: ApiPlaylistResult = { ...dataFromApi.data, limit: LIMIT }

      res.status(200).json({
        ...result,
        items: result.items.map((e) => {
          return {
            ...e,
            owner: {
              ...e.owner,
              id: encrypt(e.owner?.id ?? ''),
            },
          }
        }),
      })
      return
    }
  } catch (err) {
    return res
      .status(err.response.status)
      .json({ error: err.response.statusText })
  }
}
