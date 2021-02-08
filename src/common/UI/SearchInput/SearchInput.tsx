import { styled } from '../Layout'
import searchIcon from '../../assets/search.svg'

const SearchInput = styled('input', {
  backgroundColor: 'rgba(0,0,0,0.07)',
  borderRadius: '$small',
  border: 'none',
  height: '3em',
  font: 'inherit',
  fontSize: '$2',
  color: '$g00',
  width: '100%',
  paddingLeft: '$s45',
  marginBottom: '$s45',
  marginTop: '$s45',
  backgroundImage: `url(${searchIcon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: '1em',
  backgroundPositionY: 'center',
  transition: 'background',

  ':focus': {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  '::-webkit-input-placeholder': {
    color: '$g10',
  },
})

export { SearchInput }
