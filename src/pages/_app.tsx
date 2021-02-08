import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { globalStyle, AlertProvider, PromptProvider } from 'common/UI'
import { DataProvider } from 'services/state'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://09a19839497447ee87e4dfba3c833429@o475287.ingest.sentry.io/5628413',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

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

      <Sentry.ErrorBoundary fallback={'An error has occurred'}>
        <AlertProvider>
          <PromptProvider>
            <DataProvider>
              <Component {...pageProps} />
            </DataProvider>
          </PromptProvider>
        </AlertProvider>
      </Sentry.ErrorBoundary>
    </>
  )
}

export default MyApp
