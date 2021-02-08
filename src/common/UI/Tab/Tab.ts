import { styled } from '../Layout'

const Tab = styled('button', {
  fontWeight: '$8',
  fontSize: '$5',
  whiteSpace: 'nowrap',

  borderTopWidth: 4,
  borderTopColor: 'transparent',

  display: 'inline-flex',
  transition: 'all',

  paddingTop: '$bodySmall',
  paddingBottom: '$bodySmall',
  marginRight: '$s30',
  justifyContent: 'center',

  aboveMedium: {
    marginLeft: '$s50',
    marginRight: '3%',
    marginBottom: '$body',

    minWidth: '100px',

    paddingBottom: '0',
    paddingTop: '$body',

    '&:first-child': {
      marginLeft: '0',
    },
  },

  variants: {
    variant: {
      active: {
        color: '$brand50',
        borderTopColor: '$brand50',
      },
    },
  },
})

export { Tab }
