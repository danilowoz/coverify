import React, { useCallback, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { ReactComponent as Logo } from 'common/assets/logo.svg'
import {
  Button,
  styled,
  Flex,
  Text,
  Avatar,
  SubMenu,
  Menu,
  MenuAction,
} from 'common/UI'
import { useUser, useAuthentication } from 'services/authentication'
import i18n from 'services/i18n'
import { ReactComponent as Arrow } from 'common/assets/arrow-down.svg'
import { Newsletter } from 'modules/Newsletter'
import { Welcome } from 'modules/Welcome'
import { isBrowser } from 'services/firebase.client'
import { useBreakPoint } from 'common/utils/responsive'
import { useAppDispatch } from 'services/state'
import { UINavigationActions } from 'modules/Navigation'

import { version } from '../../../package.json'

type TabItems = 'newsletter' | 'welcome' | undefined

const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useUser()
  const { logIn, signOut, deleteAccount } = useAuthentication()
  const [tabVisibility, setTabVisibility] = useState<TabItems>()
  const { aboveMedium, bellowMedium } = useBreakPoint()

  useLayoutEffect(() => {
    if (user) {
      setTabVisibility(undefined)
    }

    const timer = setTimeout(() => {
      if (isBrowser && aboveMedium) {
        setTabVisibility(user ? undefined : 'welcome')
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [aboveMedium, user])

  const handleTabClick = (payload: TabItems) => {
    setTabVisibility((prev) => {
      if (prev === payload) {
        return undefined
      }

      return payload
    })
  }

  const handelTabClose = () => setTabVisibility(undefined)

  const setNavigationValue = useCallback(
    (payload: string) => {
      dispatch(UINavigationActions.setMenuSlice(payload))
    },
    [dispatch]
  )

  const renderUser = () => {
    if (!user) {
      return (
        <Button onClick={logIn} variant="outline">
          {i18n.t('logIn', { where: i18n.t('spotify') })}
        </Button>
      )
    }

    return (
      <UserContent variant="distribute">
        <Menu>
          <MenuAction>
            <Flex variant="distribute">
              {user.profilePic && user.userName && (
                <Avatar src={user.profilePic} alt={user.userName} />
              )}
              <Text size="small">{user.userName}</Text>

              <ArrowWrapper>
                <Arrow />
              </ArrowWrapper>
            </Flex>
          </MenuAction>

          <SubMenu
            items={[
              {
                text: `Coverify v${version}`,
                headerStyle: true,
              },
              {
                text: i18n.t('privacyPolicy'),
                src: '/privacy-policy',
              },
              {
                text: i18n.t('githubSourceCode'),
                src:
                  'https://github.com/danilowoz/coverify/issues/new?assignees=&labels=bug&template=bug_report.md&title=',
              },
              {
                text: i18n.t('supportFeedback'),
                src:
                  'mailto:danilowo@gmail.com?subject=Coverify%3A%20Support%20%26%20Feedback',
              },
              {
                text: i18n.t('menu.signOut'),
                onClick: signOut,
              },
              {
                text: i18n.t('menu.delete'),
                errorStyle: true,
                onClick: deleteAccount,
              },
            ]}
          />
        </Menu>
      </UserContent>
    )
  }

  return (
    <>
      <HeaderContent>
        <Flex variant="distribute">
          <MainMenu>
            <Coverify href="/">
              <InternalLink
                onClick={() =>
                  setNavigationValue(
                    bellowMedium
                      ? i18n.t('tabs.preview')
                      : i18n.t('tabs.playlists')
                  )
                }
              >
                <Logo viewBox="0 0 132 29" />
              </InternalLink>
            </Coverify>

            <Text
              onClick={() => handleTabClick('newsletter')}
              css={{ marginLeft: '$s20', cursor: 'pointer' }}
            >
              {i18n.t('whatsNew')}
            </Text>

            <Link href="/privacy-policy" passHref>
              <InternalLink>
                <Text css={{ marginLeft: '$s20' }}>
                  {i18n.t('privacyPolicy')}
                </Text>
              </InternalLink>
            </Link>
          </MainMenu>

          {renderUser()}
        </Flex>
      </HeaderContent>

      <AnimatePresence>
        {tabVisibility === 'welcome' && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.7 }}
          >
            <TabContainer>
              <Close type="button" onClick={handelTabClose}>
                ×
              </Close>
              <Welcome handleClose={handelTabClose} />
            </TabContainer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tabVisibility === 'newsletter' && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
          >
            <TabContainer>
              <Close type="button" onClick={handelTabClose}>
                ×
              </Close>
              <Newsletter />
            </TabContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const HeaderContent = styled('header', {
  padding: '$s10 $bodySmall',
  position: 'relative',
  zIndex: 999,

  '@aboveMedium': {
    padding: '$s10 $body',
  },
})

const Coverify = styled(Link, {
  svg: {
    '@bellowMedium': {
      width: '7em',
    },
  },
})

const InternalLink = styled('a', { textDecoration: 'none', cursor: 'pointer' })

const MainMenu = styled('header', {
  display: 'flex',
  alignItems: 'center',

  [`${Text}`]: {
    position: 'relative',
    top: 2,
    display: 'none',
  },

  '@aboveMedium': {
    [`${Text}`]: {
      display: 'block',
    },
  },
})

const TabContainer = styled('div', {
  textAlign: 'center',
  borderTopWidth: 1,
  borderTopColor: '$g50',
  borderTopStyle: 'solid',
  paddingTop: '$s45',
  paddingBottom: '$s20',
  position: 'relative',
})

const Close = styled('button', {
  width: '2.75em',
  height: '2.75em',
  position: 'absolute',
  top: 0,
  right: 0,
  color: '$g00',
  fontSize: '2em',
  lineHeight: 1,
})

const UserContent = styled(Flex, {
  height: '2.65em',
})

const ArrowWrapper = styled('div', {
  marginLeft: '$s10',
})

export { Header }
