/* eslint-disable no-console */
import * as crypto from 'crypto'

import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

const REDIRECT_URL = process.env.SPOTIFY_URL || 'http://localhost:3000/signin'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpotifyWebApi = require('spotify-web-api-node')

// Spotify OAuth 2 setup.
const Spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: REDIRECT_URL,
})

// Scopes to request.
const OAUTH_SCOPES = [
  'user-read-email',
  'ugc-image-upload',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
]

/**
 * Redirects the User to the Spotify authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  const state = req.cookies.state || crypto.randomBytes(20).toString('hex')

  res.setHeader(
    'Set-Cookie',
    serialize('state', state.toString(), {
      maxAge: 3600000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    })
  )

  const authorizeURL = Spotify.createAuthorizeURL(
    OAUTH_SCOPES,
    state.toString()
  )

  res.redirect(authorizeURL)
}
