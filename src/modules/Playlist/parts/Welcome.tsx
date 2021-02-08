import React from 'react'

import i18n from 'services/i18n'
import { Button, Text, styled } from 'common/UI'
import { useAuthentication } from 'services/authentication'

import welcomeSrc from '../assets/welcome.svg'

const Wrapper = styled('div', {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: '$s45 0',

  img: {
    display: 'inline-block',
    width: '60%',
    marginBottom: '$s50',
  },

  [`${Text}`]: {
    marginTop: '$s20',
  },
})

const Welcome: React.FC = () => {
  const { logIn } = useAuthentication()

  return (
    <Wrapper>
      <div>
        <img src={welcomeSrc} alt="Welcome" />
        <br />
        <Button onClick={logIn} variant="outline">
          {i18n.t('logIn', { where: i18n.t('spotify') })}
        </Button>
        <Text size="normal">{i18n.t('importPlaylist')}</Text>
      </div>
    </Wrapper>
  )
}

export { Welcome }
