import { styled } from '../Layout'

const Button = styled('button', {
  color: '$g00',
  fontSize: '$2',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderRadius: '1.5em',
  cursor: 'pointer',
  padding: '$s10 $s20',
  borderWidth: '1px',
  borderStyle: 'solid',
  whiteSpace: 'nowrap',

  '&:active': {
    color: '$g00',
  },

  variants: {
    variant: {
      normal: {
        backgroundColor: '$brand50',
        borderColor: '$brand50',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$g00',
      },
    },
  },

  '@aboveMedium': {
    padding: '$s10 $s30',
  },
})

export { Button }
