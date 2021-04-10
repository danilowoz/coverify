import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { globalStyle, AlertProvider, PromptProvider } from 'common/UI'
import { DataProvider } from 'services/state'

const MyApp = ({ Component, pageProps }: AppProps) => {
  globalStyle()

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <AlertProvider>
        <PromptProvider>
          <DataProvider>
            <Component {...pageProps} />
          </DataProvider>
        </PromptProvider>
      </AlertProvider>
    </>
  )
}

export default MyApp
