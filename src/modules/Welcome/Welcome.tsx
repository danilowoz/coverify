import React from 'react'

import { Button, styled, Text } from 'common/UI'
import { useAuthentication } from 'services/authentication'

import image from './image.gif'

const Welcome: React.FC = () => {
  const { logIn } = useAuthentication()

  return (
    <Wrapper>
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
