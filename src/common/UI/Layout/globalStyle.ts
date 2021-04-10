import { global } from './theme'

const globalStyle = global({
  '*': {
    margin: 0,
    outline: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body: {
    backgroundColor: '$g90',
    color: '$g00',
    fontFamily: '$sansSerif',
    fontSize: '16px',
    fontWeight: '$4',
  },
  button: {
    backgroundColor: 'transparent',
    border: 0,
    font: 'inherit',
    color: 'inherit',
    fontSize: '1em',
    cursor: 'pointer',
  },
})

export { globalStyle }
