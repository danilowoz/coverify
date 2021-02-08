import firebase from 'firebase'
import { useEffect } from 'react'

import { initializeApp, isBrowser } from 'services/firebase.client'

const getURLParameter = (name: string) => {
  return (
    decodeURIComponent(
      (
        new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
          location.search
        )?.[1] ?? ''
      ).replace(/\+/g, '%20')
    ) ?? null
  )
}

const tokenReceived = (data: { token: string } | { error: string }) => {
  if ('token' in data) {
    firebase
      .auth()
      .signInWithCustomToken(data.token)
      .then(() => {
        window.close()
      })
  } else {
    document.body.innerText = 'Error in the token Function: ' + data.error
  }
}

const FirebaseSign: React.FC = () => {
  useEffect(() => {
    if (isBrowser) {
      initializeApp({ mode: 'browser' })

      const URL = '/api'

      const code = getURLParameter('code')
      const state = getURLParameter('state')
      const error = getURLParameter('error')

      if (error) {
        document.body.innerText =
          'Error back from the Spotify auth page: ' + error
      } else if (!code) {
        // Start the auth flow.
        window.location.href = `${URL}/auth/redirect`
      } else {
        fetch(
          `${URL}/auth/token?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state)}`
        )
          .then((rest) => rest.json())
          .then((data) => tokenReceived(data))
      }
    }
  }, [])
  return null
}

export default FirebaseSign
