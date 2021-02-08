import { useCallback, useEffect } from 'react'
import axios from 'axios'

import { CanvasElementsSchema } from 'modules/Canvas/fabricUtils'
import { useAppDispatch, useAppSelector } from 'services/state'
import { useAlert, usePrompt } from 'common/UI'
import i18n from 'services/i18n'
import { ApiPlaylistItemResult } from 'pages/api/vendor/spotify/playlist-item'
import { useAuthentication } from 'services/authentication'

import { playlistStateActions } from '../Playlist/state'
import { canvasActions, canvasSelector } from './state'

/**
 * Save on global state and server
 */
const useSavePlaylist = () => {
  const dispatch = useAppDispatch()
  const dispatchAlert = useAlert()

  const token = useAppSelector((data) => data.user?.token)
  const playlistId = useAppSelector(canvasSelector.playlistId)
  const { refreshAccessToken } = useAuthentication()

  const handle = async (canvas: CanvasElementsSchema, jpegImage: string) => {
    try {
      await axios.post('/api/user/schema', { canvas, playlistId, token })
      await axios.post('/api/vendor/spotify/cover', {
        playlistId,
        token,
        data: jpegImage,
      })

      const playlistUpdated = await axios.get<ApiPlaylistItemResult>(
        'api/vendor/spotify/playlist-item',
        {
          params: { token, playlistId },
        }
      )

      dispatch(playlistStateActions.updateItem(playlistUpdated.data))
      dispatch(canvasActions.save(canvas))

      dispatchAlert({ message: i18n.t('alert.coverUpdated'), type: 'success' })
    } catch (err) {
      if (err.response.statusText === 'Unauthorized') {
        refreshAccessToken(() => handle(canvas, jpegImage))
      } else {
        dispatchAlert({ message: err.message, type: 'error' })
      }
    }
  }

  return handle
}

/**
 * Delete on global state and server
 */
const useDeletePlaylist = () => {
  const dispatch = useAppDispatch()
  const dispatchAlert = useAlert()

  const token = useAppSelector((data) => data.user?.token)
  const playlistId = useAppSelector(canvasSelector.playlistId)
  const itemId = `${playlistId}-delete`

  const deleteElement = async () => {
    try {
      await axios.delete('/api/user/schema', {
        params: { token, playlistId },
      })

      dispatch(canvasActions.resetData())

      dispatchAlert({
        message: i18n.t('alert.coverDeleted'),
        type: 'success',
      })
    } catch (err) {
      dispatchAlert({ message: err.message, type: 'error' })
    }
  }

  const prompt = usePrompt({
    id: itemId,
    onConfirm: deleteElement,
  })

  const handle = () => {
    prompt({ message: i18n.t('askDeleteCover'), id: itemId })
  }

  return handle
}

/**
 * Once a playlist is selected it retrieves the schema from server,
 * in case it has some data there, update the local state
 */
const useRetrieveSchemaFromServer = () => {
  const dispatchAlert = useAlert()
  const dispatch = useAppDispatch()

  const token = useAppSelector((data) => data.user?.token)
  const playlistId = useAppSelector(canvasSelector.playlistId)

  const retrieveSchema = useCallback(
    async (playlistId?: string) => {
      if (playlistId && token) {
        try {
          const data = await axios.get<{ result: CanvasElementsSchema }>(
            '/api/user/schema',
            {
              params: { token, playlistId },
            }
          )

          return data.data.result
        } catch (err) {
          dispatchAlert({ type: 'error', message: err.message })
        }
      }

      return undefined
    },
    [dispatchAlert, token]
  )

  useEffect(
    function basedOnPlaylistIdGetSchemaFromServer() {
      retrieveSchema(playlistId).then((data) => {
        if (data) {
          dispatch(canvasActions.save(data))
        } else {
          dispatch(canvasActions.resetData())
        }
      })
    },
    [dispatch, playlistId, retrieveSchema]
  )
}

export { useRetrieveSchemaFromServer, useSavePlaylist, useDeletePlaylist }
