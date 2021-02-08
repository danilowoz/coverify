import React from 'react'

import { styled, Text } from 'common/UI'

import emptySrc from '../assets/not-found.svg'

const Wrapper = styled(`div`, {
  padding: '1em 0 7em 0',
  textAlign: 'center',

  img: {
    display: 'inline-block',
    width: '50%',
    marginBottom: '$s50',
  },

  [`${Text}`]: {
    marginTop: '$s20',
  },

  button: {
    textDecoration: 'underline',

    '&:hover': {
      textDecoration: 'none',
    },
  },
})

const Empty: React.FC<{ onClickRandomWord: () => void }> = ({
  onClickRandomWord,
}) => {
  return (
    <Wrapper>
      <img src={emptySrc} alt="NotFound" />
      <Text>
        Oh crap, you&apos;ve got nothing. <br />
      </Text>

      <Text>
        <button onClick={onClickRandomWord}>
          Would you like any suggestions?
        </button>
      </Text>
    </Wrapper>
  )
}

export { Empty }
