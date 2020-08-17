import React, { useContext, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { dispatchLoading, dispatchUserToken } from './config/actions'
import { SPOTIFY_API } from './config/constants'
import i18n from 'common/i18n'
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
        dependencies.create('spotify')
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
    <a {...props} onClick={onRequest} href={SPOTIFY_API}>
      {i18n.t('logIn', { where: i18n.t('spotify') })}
    </a>
  )
}

export { UserLoginButton }
