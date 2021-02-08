import { styled } from '../Layout'

const Tag = styled('p', {
  fontSize: '$2',
  color: '$g90',
  transition: 'background',
  borderRadius: '$normal',
  paddingLeft: '$s10',
  paddingRight: '$s10',
  lineHeight: 1.7,

  variants: {
    variant: {
      success: {
        backgroundColor: '$brand50',
      },
      warning: {
        backgroundColor: '$warningText',
      },
      neutral: {
        backgroundColor: '$g30',
      },
    },
  },
})

export { Tag }
