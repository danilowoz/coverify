import firebase from 'firebase/app'
import 'firebase/analytics'

const isBrowser = typeof window !== 'undefined'

const initializeApp = ({ mode }: { mode: 'browser' | 'server' }) => {
  const CONFIG = JSON.parse(process.env.GOOGLE_FIREBASE_CLIENT ?? '{}')

  const hasCreated = firebase.apps.length > 0
  if (!hasCreated && (mode === 'browser' ? isBrowser : true)) {
    firebase.initializeApp(CONFIG)
    firebase.analytics()
  }

  return firebase
}

export { initializeApp, isBrowser }
