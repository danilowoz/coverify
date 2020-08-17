import { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { types } from './actionTypes'
import type { State, Actions } from './reducer'
import { INITIAL_STATE } from './reducer'
import { selectors } from './reducer'
import { COVER_ID, APP_NAME } from 'common/constants'
import i18n from 'common/i18n'
import { DependenciesContext } from 'common/service/context'
import { useAlert } from 'common/UI'
import type { ThunkResult } from 'config/redux'
import { actions as playlistActions } from 'modules/Playlist'
import { selectors as userSelector } from 'modules/User'

/**
 * Reset
 */
const dispatchReset = () => ({
  type: types.EDITOR_RESET,
})

/**
 * Loading
 */
const dispatchLoading = () => ({
  type: types.EDITOR_LOADING,
})

/**
 * Error
 */
const dispatchError = (message: string) => ({
  type: types.EDITOR_ERROR,
  payload: message,
})

/**
 * Update cover
 */
const dispatchUpdateCover = () => ({
  type: types.COVER_UPDATE_SUCCESS,
})

/**
 * Update playlist background
 */
const dispatchBackground = (url: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'backgroundUrl',
  payload: url,
})

/**
 * Update playlist name
 */
const dispatchPlaylistName = (value: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'playlistName',
  payload: value,
})

/**
 * Update playlist id
 */
const dispatchPlaylistId = (value: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'playlistId',
  payload: value,
})

/**
 * Update text align of cover
 */
const dispatchTextAlign = (value: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'textAlign',
  payload: value,
})

/**
 * Update font size of cover with min and max value
 */
const dispatchFontSize = (shouldIncrease: boolean): ThunkResult<void> => (
  dispatch,
  getState
) => {
  const {
    editor: { fontSize },
  } = getState()

  const TEXT_SIZE = {
    RATE: 4,
    MAX: 80,
    MIN: 20,
  }

  const newValue = shouldIncrease
    ? fontSize + TEXT_SIZE.RATE
    : fontSize - TEXT_SIZE.RATE

  dispatch({
    type: types.EDITOR_UPDATE,
    meta: 'fontSize',
    payload: Math.max(TEXT_SIZE.MIN, Math.min(newValue, TEXT_SIZE.MAX)),
  })
}

/**
 * Update font family of cover
 */
const dispatchFontFamily = (fontFamily: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'fontFamily',
  payload: fontFamily,
})

/**
 * Update color schema of cover
 */
const dispatchColorSchema = (color: State['colors']): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'colors',
  payload: color,
})

/**
 * Update main text
 */
const dispatchMainText = (text: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'mainText',
  payload: text,
})

/**
 * Update fore text
 */
const dispatchForeText = (text: string): Actions => ({
  type: types.EDITOR_UPDATE,
  meta: 'foreText',
  payload: text,
})

/**
 * Animation on cover
 */
const dispatchInitialAnimationOfMainText = (): ThunkResult<void> => (
  dispatch
) => {
  const { mainText } = INITIAL_STATE

  // Clean
  dispatch(dispatchMainText(''))

  // Typing
  setTimeout(() => {
    mainText.split('').reduce((acc, text, index) => {
      const updatedText = `${acc}${text}`

      setTimeout(() => {
        dispatch(dispatchMainText(updatedText))
      }, 100 * index)

      return updatedText
    }, '')
  }, 1000)
}

/**
 * Download cover artwork
 */
const useDownloadCoverOfPlaylist = () => {
  const dependencies = useContext(DependenciesContext)

  const submit = async () => {
    // Get node
    const node = document.getElementById(COVER_ID)
    if (!node) return

    // Create/get dependencies
    const screenShotService = dependencies.create('screenshot', { node })

    if (screenShotService) {
      await screenShotService.downloadImage(APP_NAME)
    }

    return
  }

  return submit
}

/**
 * Update cover artwork on spotify
 */
const useUpdateCoverOfPlaylist = () => {
  // Handles
  const dispatch = useDispatch()
  const alert = useAlert()
  const dependencies = useContext(DependenciesContext)
  const refetchPlaylists = playlistActions.useGetPlaylist()

  // States
  const playlistId = useSelector(selectors.getPlaylistId)
  const isConnected = useSelector(userSelector.isConnected)
  const token = useSelector(userSelector.getToken)
  const analyticsService = dependencies.get('analytics')

  const submit = async () => {
    // Check auth
    if (!isConnected) {
      const error = i18n.t('alert.errorSignIn', { where: i18n.t('spotify') })

      alert.error(error)

      if (analyticsService) {
        analyticsService.logEvent('error', error)
      }
      return
    }

    // Get node
    const node = document.getElementById(COVER_ID)
    if (!node) return

    // Create/get dependencies
    const spotifyService = dependencies.get('spotify')
    const screenShotService = dependencies.create('screenshot', { node })

    dispatch(dispatchLoading())

    if (screenShotService && spotifyService && playlistId && token) {
      try {
        const snapshot = await screenShotService.getImage()

        if (snapshot) {
          await spotifyService.updatePlaylistCover(playlistId, snapshot, token)

          dispatch(dispatchUpdateCover())
          refetchPlaylists()
          alert.info(i18n.t('alert.coverUpdated'))
        }
      } catch (err) {
        dispatch(dispatchError(err?.status ?? 'general'))
      }
    }

    return
  }

  return submit
}

export {
  dispatchReset,
  dispatchForeText,
  dispatchMainText,
  dispatchBackground,
  dispatchPlaylistId,
  dispatchPlaylistName,
  dispatchTextAlign,
  dispatchFontSize,
  dispatchFontFamily,
  dispatchColorSchema,
  dispatchInitialAnimationOfMainText,
  useUpdateCoverOfPlaylist,
  useDownloadCoverOfPlaylist,
}
