/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { encrypt } from 'common/utils/encrypt'
import { initializeAdminApp } from 'services/firebase.server'

const REDIRECT_URL = process.env.SPOTIFY_URL || 'http://localhost:3000/signin'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpotifyWebApi = require('spotify-web-api-node')

// Spotify OAuth 2 setup.
const Spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: REDIRECT_URL,
})

/**
 * Exchanges a given Spotify auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.cookies.state) {
      throw new Error(
        'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
      )
    } else if (req.cookies.state !== req.query.state) {
      throw new Error('State validation failed')
    }

    type FirebaseBody = {
      body: {
        access_token: string
        refresh_token: string
      }
    }

    type SpotifyBody = {
      body: {
        id: string
        images?: { url?: string }[]
        display_name?: string
        email: string
      }
    }

    Spotify.authorizationCodeGrant(
      req.query.code,
      (error: string, data: FirebaseBody) => {
        if (error) {
          throw error
        }

        Spotify.setAccessToken(data.body['access_token'])

        Spotify.getMe(async (error: string, userResults: SpotifyBody) => {
          if (error) {
            throw error
          }

          // We have a Spotify access token and the user identity now.
          const accessToken = data.body['access_token']
          const refreshToken = data.body['refresh_token']
          const spotifyUserID = userResults.body['id']
          const userName = userResults.body?.['display_name'] ?? ''
          const profilePic =
            userResults.body?.['images']?.[0]?.['url'] ??
            `https://eu.ui-avatars.com/api/?name=${userName.replace(/ /g, '+')}`

          // Create a Firebase account and get the Custom Auth Token.
          const firebaseToken = await createFirebaseAccount(
            spotifyUserID,
            userName,
            profilePic,
            accessToken,
            refreshToken
          )

          // Serve an HTML page that signs the user in and updates the user profile.
          res.json({ token: firebaseToken })
        })
      }
    )
  } catch (err) {
    res.status(500).json({ error: err.message })
  }

  return null
}

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(
  spotifyID: string,
  displayName: string,
  photoURL: string,
  accessToken: string,
  refreshToken: string
) {
  initializeAdminApp()

  // The UID we'll assign to the user.
  const uid = encrypt(spotifyID)

  await admin
    .database()
    .ref(`/spotifyAccessToken/${uid}`)
    .update({ accessToken, refreshToken })

  // Create or update the user account.
  await admin
    .auth()
    .updateUser(uid, {
      displayName: displayName,
      photoURL: photoURL,
    })
    .catch((error: any) => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: displayName,
          photoURL: photoURL,
        })
      }
      throw error
    })

  // Create a Firebase custom auth token.
  const token = await admin.auth().createCustomToken(uid)

  return token
}
