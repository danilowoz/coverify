import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { Header } from 'modules/Header'
import { Navigation } from 'modules/Navigation'
import { Main, styled } from 'common/UI'
import { Playlist } from 'modules/Playlist'
import { Backgrounds } from 'modules/Backgrounds'
import { Canvas } from 'modules/Canvas'
import { StyleConfig } from 'modules/StyleConfig'
import { useAppSelector } from 'services/state'
import i18n from 'services/i18n'
import { useBreakPoint } from 'common/utils/responsive'
import { useLockBodyScroll } from 'common/utils/layout'
import SEO from 'modules/SEO'
import { CookieCompliance } from 'modules/CookieCompliance'

const IndexPage: React.FC = () => {
  const [contentClosedHeight, setContentClosedHeight] = useState('auto')

  const menu = useAppSelector((store) => store.menu)
  const isMenuOpened = menu !== i18n.t('tabs.preview')

  const canvasBackgroundColor = useAppSelector(
    (store) => store.canvas.data.backgroundColor
  )

  const { bellowMedium } = useBreakPoint()

  useEffect(
    function handleContentHeight() {
      setContentClosedHeight(bellowMedium ? '4.5em' : 'auto')
    },
    [bellowMedium]
  )

  useLockBodyScroll(bellowMedium && isMenuOpened)

  const menusOptions: { [key: string]: React.FC } = {
    [i18n.t('tabs.playlists')]: Playlist,
    [i18n.t('tabs.background')]: Backgrounds,
    [i18n.t('tabs.style')]: StyleConfig,
  }

  const MenuActive = menusOptions[menu]

  return (
    <>
      <SEO />
      <Header />

      <Main style={{ '--canvas-main-color': canvasBackgroundColor } as any}>
        <Layout>
          <Stage>
            <Canvas />
          </Stage>

          <HandleContent
            animate={{
              borderTopLeftRadius: isMenuOpened ? '1.5em' : '0em',
              borderTopRightRadius: isMenuOpened ? '1.5em' : '0em',
              height:
                isMenuOpened && bellowMedium ? '75vh' : contentClosedHeight,
            }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <ScrollView>
              <Navigation />

              {MenuActive && <MenuActive />}
            </ScrollView>
          </HandleContent>
        </Layout>
      </Main>

      <CookieCompliance />
    </>
  )
}

// full height, minus body padding, minus header's height
const MAIN_HEIGHT_MOBILE = 'calc(100vh - 4.5em - 3em)'
const MAIN_HEIGHT = 'calc(100vh - 4.5em)'

const Layout = styled('div', {
  position: 'relative',
  zIndex: 2,
  minHeight: MAIN_HEIGHT_MOBILE,

  '@aboveMedium': {
    minHeight: 'auto',
    display: 'flex',
  },
})

const Stage = styled('div', {
  '@aboveMedium': {
    height: '100%',
    width: '30%',
    marginRight: '$body',
  },
})

const HandleContent = styled(motion.div, {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$g50',
  boxShadow: '0 -1px 7px 0 rgba(0,0,0,0.3)',
  overflow: 'auto',

  '@aboveMedium': {
    overflow: 'visible',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    position: 'static',
    width: '70%',
  },
})

const ScrollView = styled('section', {
  paddingLeft: '$bodySmall',
  paddingRight: '$bodySmall',

  '@aboveMedium': {
    marginRight: '-$body',
    marginLeft: '$body',
    marginTop: '-$body',
    marginBottom: '-$body',

    paddingTop: '$body',
    paddingBottom: '$body',
    paddingRight: '$body',
    paddingLeft: '0',

    height: MAIN_HEIGHT,
    overflow: 'auto',
  },
})

export default IndexPage
