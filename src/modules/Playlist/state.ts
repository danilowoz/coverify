import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiPlaylistItemResult } from 'pages/api/vendor/spotify/playlist-item'
import { ApiPlaylistResult } from 'pages/api/vendor/spotify/playlists'

type PlaylistState = ApiPlaylistResult['items']

const initialState: {
  data: PlaylistState
  pagination: {
    current: number
    next?: number
    history: number[]
    hasNext: boolean
  }
} = {
  data: [],
  pagination: { current: 0, history: [], hasNext: false },
}

const {
  reducer: playlistStateReducer,
  actions: playlistStateActions,
} = createSlice({
  initialState,
  name: 'playlist',
  reducers: {
    set(state, action: PayloadAction<ApiPlaylistResult['items']>) {
      return {
        ...state,
        data: [...(state.data ?? []), ...(action.payload ?? [])],
      }
    },
    updateItem(state, action: PayloadAction<ApiPlaylistItemResult>) {
      return {
        ...state,
        data: state.data?.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload
          }

          return item
        }),
      }
    },
    goToNextPage(state) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current: state.pagination.next ?? 0,
        },
      }
    },
    setNextPageOffset(
      state,
      action: PayloadAction<{
        query?: string
        next: number
        past: number
        hasNext: boolean
      }>
    ) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          query: action.payload.query,
          hasNext: action.payload.hasNext,
          next: action.payload.next,
          history: [...state.pagination.history, action.payload.past],
        },
      }
    },
  },
})

export { playlistStateReducer, playlistStateActions }
