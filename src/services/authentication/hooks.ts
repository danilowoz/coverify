import firebase from 'firebase'
import { useCallback, useEffect } from 'react'
import axios from 'axios'
import { shallowEqual } from 'react-redux'

import { useAppDispatch, useAppSelector } from 'services/state'
import { initializeApp, isBrowser } from 'services/firebase.client'
import { useAlert } from 'common/UI'

import { authActions } from './stateSlice'

const useAuthentication = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((data) => data.user?.token)

  const logIn = () => window.open('signin', 'name', 'height=585,width=400')

  const signOut = useCallback(async () => {
    await firebase.auth().signOut()

    dispatch(authActions.reset())
  }, [dispatch])

  const refreshAccessToken = useCallback(
    async (callback?: () => void) => {
      if (token) {
        await axios.get('/api/auth/refresh-token', { params: { token: token } })

        callback?.()
      }
    },
    [token]
  )

  const deleteAccount = useCallback(async () => {
    if (token) {
      await axios.get('/api/auth/delete-account', { params: { token } })

      await firebase
        .auth()
        .currentUser?.delete()
        .then(async () => {
          window.alert('Account deleted')

          dispatch(authActions.reset())
        })
        .catch((error) => {
          if (error.code === 'auth/requires-recent-login') {
            window.alert(
              'You need to have recently signed-in to delete your account. Please sign-in and try again.'
            )
            firebase.auth().signOut()
          }
        })
    }
  }, [dispatch, token])

  return { deleteAccount, logIn, refreshAccessToken, signOut }
}

const useUser = () => {
  const dispatch = useAppDispatch()
  const userData = useAppSelector((data) => data.user, shallowEqual)
  const dispatchAlert = useAlert()

  useEffect(() => {
    if (isBrowser) {
      /**
       * Firebase methods
       */
      initializeApp({ mode: 'browser' })

      const handleFirebaseUser = async (user: firebase.User | null) => {
        if (user) {
          const token = await user.getIdToken()

          return dispatch(
            authActions.set({
              id: user.uid,
              profilePic: user.photoURL,
              token,
              userName: user.displayName,
            })
          )
        }

        return dispatch(authActions.reset())
      }

      const handleFirebaseError = (error: firebase.auth.Error | null) => {
        if (error?.message) {
          dispatchAlert({ message: error?.message, type: 'error' })
        }
      }

      /**
       * Firebase listener
       */
      const unsubscribeFirebase = firebase
        .auth()
        .onAuthStateChanged(handleFirebaseUser, handleFirebaseError)

      return () => {
        unsubscribeFirebase()
      }
    }

    return () => null
  }, [dispatch, dispatchAlert])

  return userData
}

export { useUser, useAuthentication }
