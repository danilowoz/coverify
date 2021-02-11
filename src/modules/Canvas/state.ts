import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CanvasElementsSchema } from 'modules/Canvas/fabricUtils'

const INITIAL_STATE: {
  data: CanvasElementsSchema
  config: {
    saved?: boolean
    shouldRefreshCanvas: boolean
    playlistId?: string
  }
} = {
  config: {
    playlistId: undefined,
    shouldRefreshCanvas: false,
  },
  data: {
    backgroundFilters: { filters: [], gradients: { list: [] } },
    backgroundUrl:
      'https://images.unsplash.com/photo-1485872299829-c673f5194813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjE4NjV8MHwxfHNlYXJjaHw0fHxwYXJ0eXxlbnwwfHx8&ixlib=rb-1.2.1&q=80&w=1080',
    backgroundColor: '#0c2640',
    typeConfig: {
      fontFamily: 'Roboto',
      fontSize: 20,
    },
    types: [
      {
        fill: '#ffffff',
        relativeLeft: 0.07,
        relativeTop: 0.07,
        scaleX: 1.19,
        scaleY: 1.19,
        text: 'This is',
      },
      {
        fill: '#ffffff',
        relativeLeft: 0.07,
        relativeTop: 0.41,
        scaleX: 2.8,
        scaleY: 2.8,
        text: 'Coverify',
        fontWeight: 'bold',
      },
    ],
  },
}

const { actions: canvasActions, reducer: canvasReducer } = createSlice({
  initialState: INITIAL_STATE,
  name: 'canvas',
  reducers: {
    resetData: (state) => ({
      config: {
        playlistId: state.config.playlistId,
        shouldRefreshCanvas: true,
      },
      data: INITIAL_STATE.data,
    }),
    setRefreshCanvasOff: (state) => ({
      ...state,
      config: {
        ...state.config,
        shouldRefreshCanvas: false,
      },
    }),
    save: (state, action: PayloadAction<CanvasElementsSchema>) => ({
      config: {
        ...state.config,
        saved: true,
        shouldRefreshCanvas: true,
      },
      data: action.payload,
    }),
    setPlaylist: (state, action: PayloadAction<string>) => ({
      ...state,
      config: {
        ...state.config,
        playlistId: action.payload,
      },
    }),
    putIndexColor: (
      state,
      action: PayloadAction<{ color: string; index: number }>
    ) => ({
      ...state,
      data: {
        ...state.data,
        types: (state.data.types ?? []).map((type, index) => {
          if (index === action.payload.index) {
            return {
              ...type,
              fill: action.payload.color,
            }
          }

          return type
        }),
      },
      config: {
        ...state.config,
        shouldRefreshCanvas: true,
      },
    }),
    putColors: (
      state,
      action: PayloadAction<Record<'foreground' | 'main', string>>
    ) => ({
      ...state,
      data: {
        ...state.data,
        types: (state.data.types ?? []).map((type, index) => {
          if (index === 0) {
            return { ...type, fill: action.payload.foreground }
          }

          if (index === 1) {
            return { ...type, fill: action.payload.main }
          }

          return type
        }),
      },
      config: {
        ...state.config,
        shouldRefreshCanvas: true,
      },
    }),
    putFontFamily: (state, action: PayloadAction<string>) => ({
      config: {
        ...state.config,
        saved: false,
        shouldRefreshCanvas: true,
      },
      data: {
        ...state.data,
        typeConfig: {
          ...state.data.typeConfig,
          fontFamily: action.payload,
        },
      },
    }),
    putBackgroundFilter: (
      state,
      action: PayloadAction<CanvasElementsSchema['backgroundFilters']>
    ) => ({
      config: {
        ...state.config,
        saved: false,
        shouldRefreshCanvas: true,
      },
      data: {
        ...state.data,
        backgroundFilters: action.payload,
      },
    }),
    putTypes: (
      state,
      action: PayloadAction<Pick<CanvasElementsSchema, 'typeConfig' | 'types'>>
    ) => ({
      config: {
        ...state.config,
        saved: false,
      },
      data: {
        ...state.data,
        typeConfig: action.payload.typeConfig,
        types: action.payload.types,
      },
    }),
    putBackground: (
      state,
      action: PayloadAction<{ url: string; color: string }>
    ) => ({
      config: {
        ...state.config,
        saved: false,
        shouldRefreshCanvas: true,
      },
      data: {
        ...state.data,
        backgroundUrl: action.payload.url,
        backgroundColor: action.payload.color,
      },
    }),
    setSaved: (state, action: PayloadAction<boolean>) => ({
      ...state,
      config: {
        ...state.config,
        saved: action.payload,
      },
    }),
  },
})

const canvasSelector = {
  configSave: (data: { canvas: typeof INITIAL_STATE }) =>
    data.canvas.config.saved,
  data: (data: { canvas: typeof INITIAL_STATE }) => data.canvas.data,
  playlistId: (data: { canvas: typeof INITIAL_STATE }) =>
    data.canvas.config.playlistId,
  currentColors: (data: { canvas: typeof INITIAL_STATE }) =>
    (data.canvas.data.types ?? []).map((e) => e.fill),
  currentFontFamily: (data: { canvas: typeof INITIAL_STATE }) =>
    data.canvas.data.typeConfig.fontFamily,
}

export { canvasReducer, canvasActions, canvasSelector }
