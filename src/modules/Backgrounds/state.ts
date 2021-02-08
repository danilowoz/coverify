import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiBackgroundImagesResult } from 'pages/api/vendor/editor/search-images'

import { getRandomWordList } from './parts/randomTerms'

const initialState: {
  data: ApiBackgroundImagesResult['results']
  pagination: {
    current: number
    next?: number
    history: number[]
    hasNext: boolean
    query: string
  }
} = {
  data: [],
  pagination: {
    query: getRandomWordList(),
    current: 0,
    history: [],
    hasNext: false,
  },
}

const {
  reducer: backgroundsStateReducer,
  actions: backgroundsStateActions,
} = createSlice({
  initialState,
  name: 'backgrounds',
  reducers: {
    set(state, action: PayloadAction<ApiBackgroundImagesResult['results']>) {
      return {
        ...state,
        data: [...(state.data ?? []), ...(action.payload ?? [])],
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
    setQuery(_state, action: PayloadAction<string>) {
      return {
        ...initialState,
        pagination: {
          ...initialState.pagination,
          query: action.payload,
        },
      }
    },
    setRandomQuery() {
      return {
        ...initialState,
        pagination: {
          ...initialState.pagination,
          query: getRandomWordList(),
        },
      }
    },
    setNextPageOffset(
      state,
      action: PayloadAction<{ next: number; past: number; hasNext: boolean }>
    ) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          hasNext: action.payload.hasNext,
          next: action.payload.next,
          history: [...state.pagination.history, action.payload.past],
        },
      }
    },
  },
})

export { backgroundsStateReducer, backgroundsStateActions }
