import React from 'react'

import { Button, styled, Text } from 'common/UI'

const Newsletter: React.FC = () => {
  return (
    <div id="mc_embed_signup">
      <form
        action="https://now.us9.list-manage.com/subscribe/post?u=2746d73ceaabab5519e22b3bb&amp;id=068de039de"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate
      >
        <Text>Want to be update with latest features and news?</Text>
        <Wrapper id="mc_embed_signup_scroll">
          <div className="mc-field-group">
            <Input
              type="email"
              defaultValue=""
              placeholder="Email Address"
              name="EMAIL"
              className="required email"
              id="mce-EMAIL"
            />
          </div>
          <div id="mce-responses" className="clear">
            <div
              className="response"
              id="mce-error-response"
              style={{ display: 'none' }}
            />
            <div
              className="response"
              id="mce-success-response"
              style={{ display: 'none' }}
            />
          </div>{' '}
          {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
          <div
            style={{ position: 'absolute', left: '-5000px' }}
            aria-hidden="true"
          >
            <Input
              type="text"
              name="b_2746d73ceaabab5519e22b3bb_068de039de"
              tabIndex={-1}
            />
          </div>
          <div>
            <Button
              variant="outline"
              as="input"
              type="submit"
              defaultValue="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="Send"
            />
          </div>
        </Wrapper>
      </form>
    </div>
  )
}

const Wrapper = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  margin: '2em auto',
  textAlign: 'center',
})

const Input = styled('input', {
  color: '#fff',
  border: 0,
  padding: '1.1em 1.6em',
  borderRadius: '30px',
  marginRight: '1em',

  aboveSmall: {
    width: '30em',
  },
})

export { Newsletter }
