const hasLoaded: Record<string, boolean> = {}

const fetchPromiseStylesheet = (url: string) => {
  return new Promise((resolve) => {
    if (hasLoaded[url]) {
      return resolve(undefined)
    }

    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.onload = () => {
      hasLoaded[url] = true

      // Push to end of the stack
      window.requestAnimationFrame(() => {
        resolve(undefined)
      })
    }
    link.href = url

    const headScript = document.querySelector('script')
    headScript?.parentNode?.insertBefore(link, headScript)
  })
}

export { fetchPromiseStylesheet }
