import { styled } from '../Layout'

const Text = styled('p', {
  color: '$g00',
  fontSize: '$3',

  variants: {
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    bold: {
      true: {
        fontWeight: 'bold',
      },
    },
    size: {
      smaller: {
        fontSize: '$1',
      },
      small: {
        fontSize: '$2',
      },
      normal: {
        fontSize: '$3',
      },
      big: {
        fontSize: '$5',
      },
      bigger: {
        fontSize: '$9',
      },
    },
    color: {
      error: {
        color: '$errorText',
      },
      brand: {
        color: '$brand50',
      },
      g00: {
        color: '$g00',
      },
      g10: {
        color: '$g00',
      },
      g30: {
        color: '$g30',
      },
      g90: {
        color: '$g90',
      },
    },
  },
})

export { Text }
