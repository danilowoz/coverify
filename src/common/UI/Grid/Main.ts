import { styled } from '../Layout'

const Main = styled('main', {
  borderTopLeftRadius: '1.5em',
  borderTopRightRadius: '1.5em',
  backgroundColor: '$g50',
  backgroundImage: 'linear-gradient(0deg, $g80 36%, $g50 100%)',
  position: 'relative',
  overflow: 'hidden',

  padding: '$bodySmall',
  paddingBottom: '$s100',

  '@aboveMedium': {
    padding: '$body',
  },

  '&:before': {
    content: "''",
    position: 'absolute',
    top: '-40%',
    left: '-70%',
    right: '0%',
    bottom: '-10%',
    transition: 'all',
    backgroundImage:
      'radial-gradient(80% 95%, var(--canvas-main-color) 13%, $g90Alpha 50%, rgba(0,0,0,0.00) 100%, $g30 100%)',
    zIndex: 1,
    opacity: 0.5,
  },
})

export { Main }
