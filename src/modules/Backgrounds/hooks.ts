import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { shallowEqual } from 'react-redux'

import { useAuthentication } from 'services/authentication'
import { ApiBackgroundImagesResult } from 'pages/api/vendor/editor/search-images'
import { useAppDispatch, useAppSelector } from 'services/state'

import { backgroundsStateActions } from './state'

const useDownloadImage = () => {
  const handler = async (id: string) => {
    await axios.get(`api/vendor/editor/download-image`, { params: { id } })
  }

  return handler
}

const useBackgrounds = () => {
  const [loading, setLoading] = useState(false)

  /**
   * From Store
   */
  const dispatch = useAppDispatch()
  const pagination = useAppSelector((data) => data.backgrounds.pagination)
  const query = useAppSelector((data) => data.backgrounds.pagination.query)
  const backgrounds = useAppSelector(
    (data) => data.backgrounds.data,
    shallowEqual
  )

  const { refreshAccessToken } = useAuthentication()

  const currentOffset = pagination.current
  const historyOffset = pagination.history

  const getData = useCallback(async () => {
    const haveNotCalledBefore =
      historyOffset.findIndex((e) => e === currentOffset) === -1

    if (haveNotCalledBefore) {
      try {
        setLoading(true)

        const { data } = await axios.get<ApiBackgroundImagesResult>(
          `/api/vendor/editor/search-images`,
          {
            params: { query, page: currentOffset },
          }
        )

        /**
         * Full fill data
         */
        dispatch(backgroundsStateActions.set(data.results))

        /**
         * Set offset values
         */
        dispatch(
          backgroundsStateActions.setNextPageOffset({
            next: currentOffset + 1,
            past: currentOffset,
            hasNext: data.total_pages > currentOffset,
          })
        )
        setLoading(false)
      } catch (err) {
        setLoading(false)
        const status = [err.response.statusText, err.response.data.error]
        if (status.some((e) => e === 'Unauthorized')) {
          refreshAccessToken(getData)
        }
      }
    }
  }, [dispatch, currentOffset, historyOffset, query, refreshAccessToken])

  useEffect(
    function queryInitialState() {
      getData()
    },
    [dispatch, getData, query]
  )

  return {
    getMore: () => dispatch(backgroundsStateActions.goToNextPage()),
    hasMoreItems: pagination.hasNext,
    loading,
    data: backgrounds,
  }
}

export { useDownloadImage, useBackgrounds }
