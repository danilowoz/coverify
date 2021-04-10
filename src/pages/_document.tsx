import React from 'react'
import NextDocument, { Head, Html, Main, NextScript } from 'next/document'

import { getCssString } from 'common/UI'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
