import { styled } from '../Layout'

const Flex = styled('div', {
  display: 'flex',
  variants: {
    variant: {
      distribute: {
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      verticalCenter: {
        alignItems: 'center',
      },
    },
  },
})

export { Flex }
