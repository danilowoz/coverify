import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Text } from 'common/UI'

const Form = styled.form`
  text-align: center;
  border-top: 1px solid var(--color-white-lighter);
  padding-top: 2em;
  position: relative;
`

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 2em auto;
  text-align: center;
`

const Input = styled.input`
  color: #fff;
  border: 1px solid var(--color-white-light);
  padding: 0.7em 1.6em;
  border-radius: 30px;
  transition: all 0.3s ease;
  margin-right: 1em;

  &:focus {
    background: var(--color-white-lighter);
  }
`

const Close = styled.button`
  width: 2.75em;
  height: 2.75em;
  position: absolute;
  top: 0em;
  right: 0em;
  color: var(--color-white-light);
  font-size: 2em;
  line-height: 1;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-white);
  }
`

const Newsletter: React.FC = () => {
  const showSection = window.localStorage.getItem('coverify-newsletter')
  const [closeSection, setCloseSection] = useState(!!showSection)

  const handleClick = () => {
    window.localStorage.setItem('coverify-newsletter', 'true')
    setCloseSection(true)
  }

  if (closeSection) return null

  return (
    <div id="mc_embed_signup">
      <Form
        action="https://now.us9.list-manage.com/subscribe/post?u=2746d73ceaabab5519e22b3bb&amp;id=068de039de"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate
      >
        <Close onClick={handleClick}>×</Close>
        <Text size="heading">
          Want to be update with latest features and news?
        </Text>
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
      </Form>
    </div>
  )
}

export default Newsletter
