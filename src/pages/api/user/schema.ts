import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserIdFromTokenId } from 'services/firebase.server'

const checkUser = async (token: string) => {
  const uid = await getUserIdFromTokenId(token as string)

  if (uid) {
    return uid
  }

  return false
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * SAVE
   */
  if (req.method === 'POST') {
    try {
      // Check user
      const uid = await checkUser(req.body.token)

      // Body
      const canvas = req.body.canvas
      const playlistId = req.body.playlistId

      if (!canvas) {
        res.status(400).json({ error: 'missing data field' })
        return
      }

      await admin.database().ref(`/playlistsSchema/${playlistId}`).set(canvas)
      await admin
        .database()
        .ref(`/spotifyAccessToken/${uid}/playlists`)
        .push(playlistId)

      res.status(200).json({ result: 'ok' })
      return
    } catch (err) {
      res.status(400).json({ error: err.message })
      return
    }
  } else if (req.method === 'GET') {
    /**
     * GET
     */
    try {
      // Check user
      await checkUser(req.query.token as string)

      // Body
      const playlistId = req.query.playlistId
      if (!playlistId) {
        res.status(400).json({ error: 'missing playlistId field' })
        return
      }

      admin
        .database()
        .ref(`/playlistsSchema/${playlistId}`)
        .on('value', async (snap) => {
          res.status(200).json({ result: snap.val() })
        })
    } catch (err) {
      res.status(400).json({ error: err.message })
      return
    }
  } else if (req.method === 'DELETE') {
    /**
     * DELETE
     */
    try {
      // Check user
      await checkUser(req.body.token)

      // Body
      const playlistId = req.query.playlistId
      if (!playlistId) {
        res.status(400).json({ error: 'missing playlistId field' })
        return
      }

      admin.database().ref(`/playlistsSchema/${playlistId}`).remove()
      res.status(200).json({ result: 'ok' })
    } catch (err) {
      res.status(400).json({ error: err.message })
      return
    }
  } else {
    res.status(400).json({ error: 'method not supported' })
  }
}
