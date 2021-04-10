import React, { useEffect } from 'react'

import { Button, styled, Text } from 'common/UI'
import { useAuthentication } from 'services/authentication'
import { keyframes } from 'common/UI/Layout/theme'

import image from './image.gif'

const TIMER_TO_CLOSE = 15_000

const Welcome: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const { logIn } = useAuthentication()

  useEffect(() => {
    const timer = setTimeout(handleClose, TIMER_TO_CLOSE)

    return () => clearTimeout(timer)
  }, [handleClose])

  return (
    <Wrapper>
      <Counter />
      <div>
        <Image src={image} alt="Coverify" />
      </div>

      <Content>
        <Text size="bigger" bold>
          Coverify 2.0
        </Text>

        <Item css={{ marginTop: '$s10' }}>
          <span role="img" aria-label="emoji">
            📷
          </span>{' '}
          +1M background images;
        </Item>
        <Item>
          <span role="img" aria-label="emoji">
            🎧
          </span>{' '}
          Spotify gradient effects;
        </Item>
        <Item>
          <span role="img" aria-label="emoji">
            🎨
          </span>{' '}
          Endless colors and typographies;
        </Item>
        <Item>
          <span role="img" aria-label="emoji">
            ⚡️
          </span>{' '}
          Update directly on Spotify
        </Item>

        <Button onClick={logIn} css={{ marginTop: '$s45' }} variant="normal">
          Log in with Spotify to start
        </Button>
      </Content>
    </Wrapper>
  )
}

const increaseAnimation = keyframes({
  from: {
    width: '0%',
  },
  to: {
    width: '100%',
  },
})

const Counter = styled('div', {
  height: '1px',
  backgroundColor: '$brand50',
  width: '100%',
  position: 'absolute',
  left: 0,
  right: 0,
  top: -1,
  animation: `${increaseAnimation} ${TIMER_TO_CLOSE}ms linear`,
})

const Image = styled('img', {
  borderRadius: '$small',
  marginRight: '$s45',
  width: '13em',
})

const Item = styled(Text, {
  marginBottom: '$s5',
})

const Wrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: '$s45',
})

const Content = styled('div', {
  textAlign: 'left',
})

export { Welcome }
