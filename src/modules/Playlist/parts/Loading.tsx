import React from 'react'
import ContentLoader from 'react-content-loader'

const Loading: React.FC = () => {
  return (
    <ContentLoader
      viewBox="0 0 800 560"
      backgroundColor="#eeeeee07"
      foregroundColor="#33333310"
      style={{ width: '100%', height: 'auto' }}
    >
      <rect rx={15} x={0} y={0} width={250} height={250} />
      <rect rx={15} x={275} y={0} width={250} height={250} />
      <rect rx={15} x={550} y={0} width={250} height={250} />

      <rect rx={15} x={0} y={310} width={250} height={250} />
      <rect rx={15} x={275} y={310} width={250} height={250} />
      <rect rx={15} x={550} y={310} width={250} height={250} />
    </ContentLoader>
  )
}

export { Loading }
