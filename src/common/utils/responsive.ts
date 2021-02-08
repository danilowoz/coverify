import { useCallback, useEffect, useState } from 'react'

const useBreakPoint = () => {
  const [breakpoints, setBreakpoints] = useState({
    aboveSmall: false,
    bellowSmall: false,
    aboveMedium: false,
    bellowMedium: false,
  })

  const handleBreakPoints = useCallback(() => {
    setBreakpoints({
      aboveSmall: window.matchMedia('(min-width: 40em)').matches,
      bellowSmall: window.matchMedia('(max-width: 40em)').matches,
      aboveMedium: window.matchMedia('(min-width: 59em)').matches,
      bellowMedium: window.matchMedia('(max-width: 59em)').matches,
    })
  }, [])

  useEffect(() => {
    handleBreakPoints()

    window.addEventListener('resize', handleBreakPoints)

    return () => {
      window.removeEventListener('resize', handleBreakPoints)
    }
  }, [handleBreakPoints])

  return breakpoints
}

export { useBreakPoint }
