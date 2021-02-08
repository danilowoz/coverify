import { motion } from 'framer-motion'
import React from 'react'

import { styled } from '../Layout'
import { Text } from '../Text'
import { AlertStrut } from './types'

const Wrapper = styled(motion.div, {
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 9999,
})

const Content = styled('div', {
  margin: '$s30',
  textAlign: 'center',
  padding: '$s20 $s50',
  borderRadius: '$small',
  display: 'flex',
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',

  variants: {
    type: {
      error: {
        backgroundColor: '$errorText',
      },
      success: {
        backgroundColor: '$brand50',
      },
    },
  },
})

const Retry = styled('button', {
  opacity: '.9',
  textDecoration: 'underline',
  marginLeft: '$s10',

  ':hover': {
    textDecoration: 'none',
  },
})

const AlertMessage: React.FC<AlertStrut> = ({ type, message, handleRetry }) => {
  return (
    <Wrapper
      initial={{ opacity: 0, top: '-5em' }}
      animate={{ opacity: 1, top: 0 }}
      exit={{ opacity: 0, top: '-5em' }}
      transition={{ type: 'spring', duration: 0.6 }}
    >
      <Content type={type}>
        <Text>{message}</Text>

        {type === 'error' && handleRetry && (
          <Retry onClick={handleRetry}>Retry</Retry>
        )}
      </Content>
    </Wrapper>
  )
}

export { AlertMessage }
