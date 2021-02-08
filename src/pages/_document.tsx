import React from 'react'
import NextDocument, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

import { css } from 'common/UI'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    let extractedStyles: string[] | undefined
    ctx.renderPage = () => {
      const { styles, result } = css.getStyles(originalRenderPage)
      extractedStyles = styles
      return result
    }

    const initialProps = await NextDocument.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}

          {extractedStyles?.map((content, index) => (
            <style key={index} dangerouslySetInnerHTML={{ __html: content }} />
          ))}
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
