import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { shallowEqual } from 'react-redux'

import { useAuthentication, useUser } from 'services/authentication'
import { ApiPlaylistResult } from 'pages/api/vendor/spotify/playlists'
import { useAppDispatch, useAppSelector } from 'services/state'
import { canvasActions, canvasSelector } from 'modules/Canvas'

import { playlistStateActions } from './state'

const usePlaylists = () => {
  const [loading, setLoading] = useState(false)

  /**
   * From Store
   */
  const dispatch = useAppDispatch()
  const playlists = useAppSelector((data) => data.playlist.data, shallowEqual)
  const playlistIdSelected = useAppSelector(
    canvasSelector.playlistId,
    shallowEqual
  )
  const pagination = useAppSelector((data) => data.playlist.pagination)

  const user = useUser()
  const { refreshAccessToken } = useAuthentication()

  const token = user?.token

  const getPlaylists = useCallback(async () => {
    const haveNotCalledBefore =
      pagination.history.findIndex((e) => e === pagination.current) === -1

    if (token && haveNotCalledBefore) {
      try {
        setLoading(true)

        const { data } = await axios.get<ApiPlaylistResult>(
          `/api/vendor/spotify/playlists`,
          {
            params: { token, offset: pagination.current },
          }
        )

        /**
         * Full fill playlist data
         */
        dispatch(
          playlistStateActions.set(
            data.items.filter(
              (e) => e.owner?.id === user?.id.replace('spotify:', '')
            )
          )
        )

        /**
         * Set offset values
         */
        const { total, limit, offset } = data
        dispatch(
          playlistStateActions.setNextPageOffset({
            next: offset + limit,
            past: pagination.current,
            hasNext: total >= limit + offset,
          })
        )

        setLoading(false)
      } catch (err) {
        setLoading(false)
        const status = [err.response.statusText, err.response.data.error]
        if (status.some((e) => e === 'Unauthorized')) {
          refreshAccessToken(getPlaylists)
        }
      }
    }
  }, [dispatch, pagination, refreshAccessToken, token, user?.id])

  useEffect(
    function pickPlaylist() {
      /**
       * Pick first playlist as selected
       */
      const firstPlaylistId = playlists?.[0]?.id
      if (playlistIdSelected === undefined && firstPlaylistId) {
        dispatch(canvasActions.setPlaylist(firstPlaylistId))
      }
    },
    [dispatch, playlistIdSelected, playlists]
  )

  useEffect(() => {
    getPlaylists()
  }, [getPlaylists])

  return {
    getMore: () => dispatch(playlistStateActions.goToNextPage()),
    hasMoreItems: pagination.hasNext,
    loading,
    data: playlists,
  }
}

export { usePlaylists }
