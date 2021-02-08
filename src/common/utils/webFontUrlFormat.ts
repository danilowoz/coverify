const webFontUrlFormat = (fontFamily: string) => {
  return `https://fonts.googleapis.com/css?family=${fontFamily.replace(
    / /g,
    '+'
  )}:wght@400;700&display=swap`
}

export { webFontUrlFormat }
