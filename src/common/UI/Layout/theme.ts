import { createCss } from '@stitches/react'

const { styled, css, global, keyframes, getCssString } = createCss({
  theme: {
    colors: {
      g90: '#000',
      g90Alpha: 'rgba(0,0,0,0.49)',
      g80: '#101010',
      g50: '#262525',
      g35: 'rgba(151,151,151,.09)',
      g30: '#555555',
      g20: '#E9E9E9',
      g10: 'rgba(255,255,255,.3)',
      g00: '#fff',
      brand50: '#1db954',
      errorText: '#FB6767',
      warningText: '#FFA563',
    },
    fontSizes: {
      9: '3em',
      5: '1.125em',
      3: '1em',
      2: '0.875em',
      1: '0.6em',
    },
    fontWeights: {
      8: '800',
      4: '400',
    },
    fonts: {
      sansSerif: "'Montserrat', sans-serif;",
    },
    space: {
      body: '2.5em',
      bodySmall: '1.5em',
      s100: '6em',
      s50: '3em',
      s45: '2.5em',
      s30: '1.875em',
      s25: '1.5em',
      s21: '1.125em',
      s20: '1em',
      s10: '0.875em',
      s5: '0.4em',
    },
    radii: {
      big: '2em',
      normal: '1.125em',
      small: '0.62em',
    },
    transitions: {
      regular: 'all 300ms ease',
    },
  },
  utils: {
    transition: () => (rule = 'all') => ({
      transitionProperty: rule,
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease',
    }),
  },

  media: {
    aboveSmall: `(min-width: 40em) `,
    bellowSmall: `(max-width: 40em) `,

    aboveMedium: `(min-width: 59em) `,
    bellowMedium: `(max-width: 59em) `,
  },
})

export { styled, css, global, keyframes, getCssString }
