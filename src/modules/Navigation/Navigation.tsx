import React, { useCallback, useEffect, useState } from 'react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { styled, Tab, Text } from 'common/UI'
import i18n from 'services/i18n'
import { useAppDispatch, useAppSelector } from 'services/state'
import { useBreakPoint } from 'common/utils/responsive'

/**
 * State
 */
const initialState = i18n.t('tabs.playlists')

const { actions, reducer: UINavigationReducer } = createSlice({
  name: 'ui/menu',
  initialState,
  reducers: {
    setMenuSlice: (_state, action: PayloadAction<string>) => action.payload,
  },
})

/**
 * Component
 */
const Nav = styled('nav', {
  display: 'flex',
  overflow: 'auto',
  flexWrap: 'nowrap',
  aboveMedium: {
    marginTop: '-$body',
  },
})

const INITIAL_MENU = [
  i18n.t('tabs.playlists'),
  i18n.t('tabs.background'),
  i18n.t('tabs.style'),
  i18n.t('tabs.presets'),
]

/**
 * Main component
 */
const Navigation: React.FC = () => {
  const menuSelected = useAppSelector((data) => data.menu)
  const dispatch = useAppDispatch()
  const { bellowMedium } = useBreakPoint()

  const [menu, setMenu] = useState<string[]>(INITIAL_MENU)

  const setNavigationValue = useCallback(
    (payload: string) => {
      dispatch(actions.setMenuSlice(payload))
    },
    [dispatch]
  )

  useEffect(
    function handleMenuBasedOnBreakpoint() {
      const newMenu = [
        bellowMedium ? i18n.t('tabs.preview') : null,
        ...INITIAL_MENU,
      ].filter(Boolean)

      // Initial menu items
      setMenu(newMenu as string[])

      // Initial menu selected
      setNavigationValue(
        bellowMedium ? i18n.t('tabs.preview') : i18n.t('tabs.playlists')
      )
    },
    [bellowMedium, setNavigationValue]
  )

  return (
    <Nav>
      {menu.map((item) => {
        const isPresets = item === i18n.t('tabs.presets')

        return (
          <Tab
            onClick={() => !isPresets && setNavigationValue(item)}
            variant={menuSelected === item ? 'active' : undefined}
            key={item}
            as={isPresets ? 'div' : 'button'}
          >
            {item}

            {isPresets && (
              <Text css={{ marginLeft: '$s10' }} size="smaller" color="g10">
                {i18n.t('soon')}
              </Text>
            )}
          </Tab>
        )
      })}
    </Nav>
  )
}

export { Navigation, UINavigationReducer }
