import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import debounce from 'lodash.debounce'

import { styled, Text } from 'common/UI'
import { useAppDispatch, useAppSelector } from 'services/state'
import { canvasActions, canvasSelector } from 'modules/Canvas'
import i18n from 'services/i18n'

import { COLORS } from './colors-options'

const Colors: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentColors = useAppSelector(canvasSelector.currentColors)

  const updateColor = (color: string, index: number) => {
    dispatch(canvasActions.putIndexColor({ color, index }))
  }
  const handleChangeColor = useCallback(debounce(updateColor, 600), [])

  return (
    <Wrapper>
      <Text css={{ marginBottom: '$s10' }} size="small">
        {i18n.t('currentColors')}
      </Text>
      <Selected>
        {currentColors.map((color, index) => (
          <CurrentColor key={index}>
            <FakeInputColor style={{ backgroundColor: color }}>
              <InputColor
                type="color"
                id={`pick-color-${index}`}
                value={color}
                onChange={(event) =>
                  handleChangeColor(event.target.value, index)
                }
              />
            </FakeInputColor>
            <Text
              as="label"
              htmlFor={`pick-color-${index}`}
              css={{
                cursor: 'pointer',
                marginLeft: '$s10',
                marginRight: '$s10',
              }}
            >
              {color.toUpperCase()}
            </Text>
          </CurrentColor>
        ))}
      </Selected>

      <ScrollView>
        {COLORS.map(({ foreground, main }) => {
          return (
            <Schema
              key={`${foreground}-${main}`}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                dispatch(canvasActions.putColors({ foreground, main }))
              }
            >
              <Item style={{ backgroundColor: foreground }} />

              <Item style={{ backgroundColor: main }} />
            </Schema>
          )
        })}
      </ScrollView>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  aboveMedium: {
    width: '63%',
  },
})

const Selected = styled('div', {
  display: 'flex',
  alignItems: 'center',

  '> *': {
    marginRight: '$s5',
  },
})

const ScrollView = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  overflow: 'auto',
  maxHeight: '30vh',
  flexDirection: 'row',
  flex: 1,
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  borderTopColor: '$g35',

  marginTop: '$s20',
  paddingTop: '$s20',
})

const CurrentColor = styled('div', {
  display: 'flex',
  padding: '3px',
  borderRadius: '$big',
  alignItems: 'center',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$g10',
  cursor: 'pointer',
  backgroundColor: '$g35',
  transition: 'all',

  '&:hover': {
    backgroundColor: 'rgba(151,151,151,.4)',
  },
})

const Schema = styled(motion.button, {
  display: 'flex',
  marginRight: '$s20',
  marginBottom: '$s20',

  '> *:last-child': {
    marginLeft: '-$s20',
  },
})

const itemStyle = {
  cursor: 'pointer',
  width: '2.3em',
  height: '2.3em',
  borderRadius: '100%',
  borderWidth: 3,
  borderStyle: 'solid',
  borderColor: 'rgba(255,255,255,.17)',
  boxShadow: `0 7.2px 0.8px -13px rgba(0, 0, 0, 0.285),
  0 11px 15px -13px rgba(0, 0, 0, 0.57)`,
}
const InputColor = styled('input', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '2.3em',
  height: '2.3em',
  opacity: 0,
})

const FakeInputColor = styled('div', {
  ...itemStyle,
  position: 'relative',
  transition: 'background',
})
const Item = styled('div', itemStyle)

export { Colors }
