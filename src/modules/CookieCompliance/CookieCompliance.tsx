import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { Button, styled, Text } from 'common/UI'
import i18n from 'services/i18n'

const LOCALSTORAGE_TOKEN = '_coverify_cookie-compliance_'

const CookieCompliance: React.FC = () => {
  const [visibility, setVisibility] = useState(false)

  const setCompliance = () => {
    window.localStorage.setItem(LOCALSTORAGE_TOKEN, 'true')

    setVisibility(false)
  }

  useEffect(() => {
    const value = window.localStorage.getItem(LOCALSTORAGE_TOKEN)

    setVisibility(value !== 'true')
  }, [])

  return (
    <Wrapper
      initial={{ translateY: '200%' }}
      animate={{ translateY: visibility ? '0%' : '200%' }}
    >
      <Text css={{ lineHeight: 1.6 }}>{i18n.t('cookieCompliance')}</Text>
      <Button onClick={setCompliance}>
        {i18n.t('cookieComplianceAccept')}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled(motion.div, {
  position: 'fixed',
  bottom: '$bodySmall',
  left: '$bodySmall',
  right: '$bodySmall',
  zIndex: 9999,

  padding: '$s20',
  backgroundColor: '$g50',
  borderRadius: '$small',
  boxShadow: `
  0 3.9px 7.2px rgba(0, 0, 0, 0.125),
  0 13px 24.1px rgba(0, 0, 0, 0.185),
  0 58px 108px rgba(0, 0, 0, 0.31)`,

  [`${Button}`]: {
    flex: 1,
    marginTop: '$s10',
  },

  aboveMedium: {
    [`${Button}`]: {
      flex: 1,
      marginTop: '0',
      marginLeft: '$s45',
    },

    bottom: '$body',
    left: '$body',
    right: '$body',
    display: 'flex',
  },
})

export { CookieCompliance }
