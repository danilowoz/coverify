import { useContext, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { types } from './actionTypes'
import { selectors } from './reducer'
import { DependenciesContext } from 'common/service/context'

/**
 * Log out
 */
const dispatchLogOut = () => ({ type: types.LOG_OUT })

/**
 * Loading
 */
const dispatchLoading = () => ({
  type: types.USER_LOADING,
})

/**
 * User token
 */
const dispatchUserToken = (token: string) => ({
  type: types.USER_SIGN_SUCCESS,
  payload: token,
})

/**
 * Error
 */
const dispatchError = (message: string) => ({
  type: types.USER_ERROR,
  payload: message,
})

/**
 * Listener of event
 */
const useGetInformationOfUser = () => {
  const dispatch = useDispatch()
  const dependencies = useContext(DependenciesContext)
  const token = useSelector(selectors.getToken)
  const spotifyService = dependencies.get('spotify')

  /**
   * Handle
   */
  const submit = useCallback(async () => {
    // get service

    if (spotifyService && token) {
      dispatch(dispatchLoading())

      try {
        const userData = await spotifyService.getUserInformation(token)
        dispatch({ type: types.USER_INFO_SUCCESS, payload: userData })
      } catch (err) {
        dependencies.destroy('spotify')
        dispatch(dispatchError(String(err?.response?.status ?? 'general')))
      }
    } else {
      dispatch(dispatchError('general'))
    }
  }, [dependencies, dispatch, spotifyService, token])

  /**
   * Effect with dependencies
   */
  useEffect(() => {
    if (token && spotifyService) {
      submit()
    }
  }, [submit, token, spotifyService])
}

export {
  dispatchError,
  dispatchLoading,
  dispatchLogOut,
  dispatchUserToken,
  useGetInformationOfUser,
}
