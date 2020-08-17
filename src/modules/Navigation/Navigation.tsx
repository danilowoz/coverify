import dynamic from 'next/dynamic'
import React from 'react'
import styled from 'styled-components'

const NewsletterNoSSR = dynamic(() => import('../Newsletter'), {
  ssr: false,
})

import i18n from 'common/i18n'
import { COVER_SIZE_COMPACT, MAIN_BREAKPOINT } from 'common/sizes'
import { Tabs, Container } from 'common/UI'
import Backgrounds from 'modules/Backgrounds'
import Playlist from 'modules/Playlist'

const CustomTab = styled(Tabs)`
  position: sticky;
  top: 4.8em;
  z-index: 5;

  @media (min-width: ${MAIN_BREAKPOINT}) {
    top: calc(${COVER_SIZE_COMPACT} + 1.9em);
  }
`

const Navigation: React.FC = () => {
  return (
    <Container>
      <NewsletterNoSSR />

      <CustomTab
        data={[
          {
            title: i18n.t('navigation.myPlaylists'),
            content: <Playlist />,
          },
          {
            title: i18n.t('navigation.backgroundImage'),
            content: <Backgrounds />,
          },
        ]}
      />
    </Container>
  )
}

export { Navigation }
