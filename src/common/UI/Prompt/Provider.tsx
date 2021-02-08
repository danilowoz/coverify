import { motion, AnimatePresence } from 'framer-motion'
import React, { createContext, useContext, useEffect, useState } from 'react'

import i18n from 'services/i18n'

import { styled } from '../Layout'
import { Text } from '../Text'

/**
 * Parts
 */
const Wrapper = styled(motion.div, {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 999999,
  backgroundImage:
    'radial-gradient(circle, rgba(0,0,0,.8) 30%, rgba(0,0,0,0.3) 100%)',
  display: 'flex',
})

const Box = styled(motion.div, {
  margin: 'auto',
  maxWidth: '90vw',
  width: '20em',
  padding: '$s21',

  backgroundColor: '$g00',
  borderRadius: '$small',
  boxShadow: '0 5px 8.7px #110d0d',
})

const WrapperButtons = styled('div', {
  marginLeft: '-$s21',
  marginRight: '-$s21',
  marginBottom: '-$s21',
  marginTop: '$s21',

  borderTopWidth: 1,
  borderTopStyle: 'solid',
  borderTopColor: '$g20',

  display: 'flex',

  'button:first-child': {
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '$g20',
  },
})

const Button = styled('button', {
  color: '$g90',
  width: '50%',
  textAlign: 'center',
  padding: '$s20',

  variants: {
    color: {
      error: {
        color: '$errorText',
      },
      brand: {
        color: '$brand50',
      },
    },
  },
})

/**
 * Main components
 */
const Context = createContext<{
  prompt: (arg: { message: string; id?: string }) => void
  handleDismiss: () => void
  id?: string
  hasCancel: boolean
  hasConfirm: boolean
}>({
  prompt: () => null,
  handleDismiss: () => null,
  id: undefined,
  hasCancel: false,
  hasConfirm: false,
})

const PromptProvider: React.FC = ({ children }) => {
  const [promptMessage, setPromptMessage] = useState<string | undefined>()
  const [id, setId] = useState<string | undefined>()

  const [hasCancel, setHasCancel] = useState(false)
  const [hasConfirm, setHasConfirm] = useState(false)

  const handleDismiss = () => {
    setPromptMessage(undefined)
    setHasConfirm(false)
    setHasCancel(false)
  }

  const handleClose = () => {
    handleDismiss()
    setHasCancel(true)
  }

  const handleConfirm = () => {
    handleDismiss()
    setHasConfirm(true)
  }

  const prompt = ({ message, id }: { message: string; id?: string }) => {
    setPromptMessage(message)
    setId(id)
  }

  return (
    <Context.Provider
      value={{ prompt, id, hasCancel, hasConfirm, handleDismiss }}
    >
      <AnimatePresence>
        {promptMessage ? (
          <Wrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <Text color="g90" size="big">
                {promptMessage}
              </Text>
              <WrapperButtons>
                <Button color="brand" onClick={handleConfirm}>
                  {i18n.t('yes')}
                </Button>
                <Button color="error" onClick={handleClose}>
                  {i18n.t('cancel')}
                </Button>
              </WrapperButtons>
            </Box>
          </Wrapper>
        ) : null}
      </AnimatePresence>
      {children}
    </Context.Provider>
  )
}

const usePrompt = ({
  id: internalId,
  onCancel,
  onConfirm,
}: {
  id?: string
  onCancel?: () => void
  onConfirm?: () => void
}) => {
  const { prompt, id, hasCancel, hasConfirm, handleDismiss } = useContext(
    Context
  )

  useEffect(() => {
    if (internalId === id) {
      if (hasCancel) {
        handleDismiss()
        return onCancel?.()
      }

      if (hasConfirm) {
        handleDismiss()
        return onConfirm?.()
      }
    }
  }, [
    handleDismiss,
    hasCancel,
    hasConfirm,
    id,
    internalId,
    onCancel,
    onConfirm,
  ])

  return prompt
}

export { PromptProvider, usePrompt }
