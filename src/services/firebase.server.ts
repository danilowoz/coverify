import * as admin from 'firebase-admin'

const ACCOUNT_SERVICE = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT ?? '{}')
const URL_DATABASE = process.env.URL_DATABASE || 'http://localhost:9000'

const getSpotifyAccessToken = (
  uid: string
): Promise<Record<'accessToken' | 'refreshToken', string>> =>
  new Promise((resolve) => {
    admin
      .database()
      .ref(`/spotifyAccessToken/${uid}`)
      .on('value', async (snap) => {
        const { refreshToken, accessToken } = snap.val() as Record<
          'accessToken' | 'refreshToken',
          string
        >

        resolve({ accessToken, refreshToken })
      })
  })

const getUserIdFromTokenId = async (tokenId: string) => {
  const hasCreated = admin.apps.length > 0

  if (!hasCreated) {
    admin.initializeApp({
      credential: admin.credential.cert(ACCOUNT_SERVICE),
      databaseURL: URL_DATABASE,
    })
  }

  const decodedToken = await admin.auth().verifyIdToken(tokenId as string, true)

  return decodedToken.uid
}

const initializeAdminApp = () => {
  const hasCreated = admin.apps.length > 0
  if (!hasCreated) {
    admin.initializeApp({
      credential: admin.credential.cert(ACCOUNT_SERVICE),
      databaseURL: URL_DATABASE,
    })
  }
}

export { getUserIdFromTokenId, getSpotifyAccessToken, initializeAdminApp }
