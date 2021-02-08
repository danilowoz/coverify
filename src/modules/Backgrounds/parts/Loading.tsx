import React from 'react'
import ContentLoader from 'react-content-loader'

const Loading = () => (
  <ContentLoader
    speed={2}
    width={1280}
    height={800}
    viewBox="0 0 1280 800"
    backgroundColor="#eeeeee07"
    foregroundColor="#33333310"
    style={{ width: '100%', height: 'auto' }}
  >
    <rect x="0" y="0" rx="12" ry="12" width="305" height="200" />
    <rect x="0" y="220" rx="12" ry="12" width="305" height="171" />
    <rect x="325" y="0" rx="12" ry="12" width="305" height="500" />
    <rect x="650" y="0" rx="12" ry="12" width="305" height="350" />
    <rect x="650" y="370" rx="12" ry="12" width="305" height="150" />
    <rect x="975" y="0" rx="12" ry="12" width="305" height="250" />
    <rect x="975" y="270" rx="12" ry="12" width="305" height="160" />
  </ContentLoader>
)

export { Loading }
