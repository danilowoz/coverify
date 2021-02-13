import React, { useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

import { version } from '../../../package.json'

type TabItems = 'newsletter' | 'sponsor' | 'welcome' | undefined

const Header: React.FC = () => {
  const user = useUser()
  const { logIn, signOut, deleteAccount } = useAuthentication()
  const [tabVisibility, setTabVisibility] = useState<TabItems>()
  const { aboveMedium } = useBreakPoint()

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
            <Logo />
            <Text
              onClick={() => handleTabClick('sponsor')}
              css={{ marginLeft: '$s45', cursor: 'pointer' }}
            >
              {i18n.t('sponsor')}
            </Text>
            <Text
              onClick={() => handleTabClick('newsletter')}
              css={{ marginLeft: '$s20', cursor: 'pointer' }}
            >
              {i18n.t('whatsNew')}
            </Text>
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
              <Close type="button" onClick={() => setTabVisibility(undefined)}>
                ×
              </Close>
              <Welcome />
            </TabContainer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tabVisibility === 'sponsor' && (
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
              <Close type="button" onClick={() => setTabVisibility(undefined)}>
                ×
              </Close>
              <iframe
                src="https://github.com/sponsors/danilowoz/card"
                title="Sponsor danilowoz"
                height="225"
                width="600"
                style={{ border: 0 }}
              />
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
              <Close type="button" onClick={() => setTabVisibility(undefined)}>
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

  aboveMedium: {
    padding: '$s10 $body',
  },
})

const MainMenu = styled('header', {
  display: 'flex',
  alignItems: 'center',

  [`${Text}`]: {
    position: 'relative',
    top: 2,
    display: 'none',
  },
  aboveMedium: {
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
