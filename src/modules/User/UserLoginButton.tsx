import React, { useContext, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { dispatchLoading, dispatchUserToken } from './config/actions'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_URL,
  SPOTIFY_SCOPE,
} from './config/constants'
import { DependenciesContext } from 'common/service/context'

const UserLoginButton: React.FC = (props) => {
  const dispatch = useDispatch()
  const dependencies = useContext(DependenciesContext)
  const analyticsService = dependencies.get('analytics')

  // User Login
  const onRequest = () => dispatch(dispatchLoading())

  const onSuccess = useCallback(
    (token?: string) => {
      // Creating context of services
      if (dependencies && token) {
        dependencies.create('spotify', { token })
        // Full field reducer
        dispatch(dispatchUserToken(token))

        // Analytics
        if (analyticsService) {
          analyticsService.logEvent('user', 'login')
        }
      } else {
        // Analytics
        if (analyticsService) {
          analyticsService.logEvent('error', 'login')
        }
      }
    },
    [analyticsService, dependencies, dispatch]
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#access_token=', '')

    if (hash) {
      const token = hash.split('&')[0]
      onSuccess(token)
      window.location.hash = ''
    }
  }, [onSuccess])

  return (
    <a
      {...props}
      onClick={onRequest}
      href={`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_URL}&scope=${SPOTIFY_SCOPE}&response_type=token&show_dialog=true`}
    >
      Login to Spotify
    </a>
  )
}

export { UserLoginButton }
