import { useLayoutEffect } from 'react'

const useLockBodyScroll = (shouldBlock: boolean) => {
  useLayoutEffect(
    function useLockBodyScrollEffect() {
      document.body.style.overflow = shouldBlock ? 'hidden' : 'visible'
    },
    [shouldBlock]
  )
}

export { useLockBodyScroll }
