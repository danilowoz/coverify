import { createStyled } from '@stitches/react'

const { styled, css } = createStyled({
  prefix: '',
  tokens: {
    colors: {
      $g90: '#000',
      $g50: '#262525',
      $g55: '#26252590',
      $g40: '#232323',
      $g35: 'rgba(151,151,151,.09)',
      $g30: '#555555',
      $g20: '#E9E9E9',
      $g10: 'rgba(255,255,255,.3)',
      $g00: '#fff',
      $brand50: '#1db954',
      $errorText: '#FB6767',
      $warningText: '#FFA563',
    },
    fontSizes: {
      $9: '3em',
      $5: '1.125em',
      $3: '1em',
      $2: '0.875em',
      $1: '0.6em',
    },
    fontWeights: {
      $8: '800',
      $4: '400',
    },
    fonts: {
      $sansSerif: "'Montserrat', sans-serif;",
    },
    space: {
      $body: '2.5em',
      $bodySmall: '1.5em',
      $s100: '6em',
      $s50: '3em',
      $s45: '2.5em',
      $s30: '1.875em',
      $s25: '1.5em',
      $s21: '1.125em',
      $s20: '1em',
      $s10: '0.875em',
      $s5: '0.4em',
    },
    radii: {
      $big: '2em',
      $normal: '1.125em',
      $small: '0.62em',
    },
    transitions: {
      $regular: 'all 300ms ease',
    },
  },
  utils: {
    transition: (rule = 'all') => ({
      transitionProperty: rule,
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease',
    }),
  },
  breakpoints: {
    aboveSmall: (rule) => `@media (min-width: 40em) { ${rule} }`,
    bellowSmall: (rule) => `@media (max-width: 40em) { ${rule} }`,

    aboveMedium: (rule) => `@media (min-width: 59em) { ${rule} }`,
    bellowMedium: (rule) => `@media (max-width: 59em) { ${rule} }`,
  },
})

export { styled, css }
