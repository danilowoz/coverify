import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'

import { UINavigationReducer } from 'modules/Navigation'
import i18n from 'services/i18n'
import { canvasReducer } from 'modules/Canvas'
import { playlistStateReducer } from 'modules/Playlist'
import { backgroundsStateReducer } from 'modules/Backgrounds'

import { authReducer } from './authentication'

/**
 * Creating
 */
const veryInitialState = {
  menu: i18n.t('tabs.playlists'),
}

const appReducer = combineReducers({
  canvas: canvasReducer,
  menu: UINavigationReducer,
  playlist: playlistStateReducer,
  backgrounds: backgroundsStateReducer,
  user: authReducer,
})

const rootReducer = (state: any, action: AnyAction) => {
  /**
   * Reset the entire reducer
   */
  if (action.type === 'user/reset') {
    state = veryInitialState
  }

  return appReducer(state, action)
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: veryInitialState,
  reducer: rootReducer,
})

/**
 * Store interface
 */
export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector = <TSelected extends unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useSelector(selector, equalityFn)

/**
 * Provider
 */
const DataProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export { DataProvider, useAppDispatch, useAppSelector }
