import { styled } from '../Layout'

const Tag = styled('p', {
  fontSize: '$2',
  color: '$g90',
  transition: 'all',
  borderRadius: '$normal',
  paddingLeft: '$s10',
  paddingRight: '$s10',
  lineHeight: 1.7,
  borderWidth: 1,
  borderStyle: 'solid',

  variants: {
    variant: {
      success: {
        color: '$brand50',
        borderColor: '$brand50',
      },
      warning: {
        color: '$warningText',
        borderColor: '$warningText',
      },
      neutral: {
        color: '$g30',
        borderColor: '$g30',
      },
    },
  },
})

export { Tag }
