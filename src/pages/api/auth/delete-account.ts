import { serialize } from 'cookie'
import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserIdFromTokenId } from 'services/firebase.server'

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

  try {
    admin
      .database()
      .ref(`/spotifyAccessToken/${userUid}/playlists`)
      .once('value', async (snap) => {
        const values = snap.val()

        if (values) {
          const playlistIds = Object.values(values)

          // Delete all schemas
          playlistIds.forEach(async (playlist) => {
            await admin.database().ref(`/playlistsSchema/${playlist}`).remove()
          })
        }

        // Delete user
        await admin.database().ref(`/spotifyAccessToken/${userUid}`).remove()

        res.setHeader(
          'Set-Cookie',
          serialize('state', '', {
            maxAge: -1,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
          })
        )

        res.status(200).json({ result: 'ok' })
      })
  } catch (err) {
    res.status(500).json({ error: err.message })
    return
  }
}
