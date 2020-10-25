import { useContext, useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { types } from './actionTypes'
import { DependenciesContext } from 'common/service/context'
import { selectors as userSelector } from 'modules/User'

/**
 * Reset
 */
const dispatchReset = () => ({ type: types.PLAYLIST_RESET })

/**
 * Loading
 */
const dispatchLoading = () => ({ type: types.PLAYLIST_LOADING })

/**
 * Error
 */
const dispatchError = (message: string) => ({
  type: types.PLAYLIST_ERROR,
  payload: message,
})

/**
 * Listener of event to get playlist from user
 */
const useGetPlaylist = () => {
  const dispatch = useDispatch()
  const userName = useSelector(userSelector.getUserName, shallowEqual)
  const dependencies = useContext(DependenciesContext)
  const spotifyService = dependencies.get('spotify')
  const token = useSelector(userSelector.getToken)

  /**
   * Handle
   */
  const submit = useCallback(async () => {
    if (spotifyService && token) {
      try {
        dispatch(dispatchLoading())

        const playlistData = await spotifyService.getUserPlaylist(token)

        const filteredData = playlistData
          ?.filter((item) => item.owner?.display_name === userName)
          .map((item) => {
            return {
              id: item.id,
              name: item.name,
              image: item.images?.[0]?.url,
            }
          })

        dispatch({ type: types.PLAYLIST_SUCCESS, payload: filteredData })
      } catch (err) {
        dispatch(dispatchError(err?.response?.status ?? 'general'))
      }
    } else {
      return dispatch(dispatchError('playlistLoad'))
    }

    return
  }, [dispatch, spotifyService, token, userName])

  /**
   * Effect with dependencies
   */
  useEffect(() => {
    submit()
  }, [submit])

  return submit
}

export { useGetPlaylist, dispatchReset }
