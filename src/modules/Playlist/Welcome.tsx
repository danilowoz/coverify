import React from 'react'
import styled from 'styled-components'

import welcomeSrc from './assets/welcome.svg'
import i18n from 'common/i18n'
import { Button, Text } from 'common/UI'
import { UserLoginButton } from 'modules/User'

const Wrapper = styled.div`
  padding: 5em 0 7em 0;
  text-align: center;
  width: 100%;

  img {
    display: inline-block;
    width: 30%;
    margin-bottom: 3em;
  }

  ${Text} {
    margin-top: 1em;
  }
`

const Welcome = () => {
  return (
    <Wrapper>
      <img src={welcomeSrc} alt="Welcome" />
      <br />
      <Button variant="outline" as={UserLoginButton}>
        {i18n.t('logIn', { where: i18n.t('spotify') })}
      </Button>
      <Text size="normal" color="white-light">
        {i18n.t('importPlaylist')}
      </Text>
    </Wrapper>
  )
}

export { Welcome }
