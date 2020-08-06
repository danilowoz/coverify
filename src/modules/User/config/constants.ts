export const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_SCOPE = [
  'ugc-image-upload',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
]
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
export const SPOTIFY_URL = process.env.SPOTIFY_URL || 'http://localhost:3000'

export const SPOTIFY_API = `${SPOTIFY_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_URL}&scope=${SPOTIFY_SCOPE.join(
  '%20'
)}&response_type=token&show_dialog=true`
