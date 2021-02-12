import React from 'react'

import { styled, Text } from 'common/UI'
import i18n from 'services/i18n'

import { Colors } from './parts/Colors'
import { FontFamily } from './parts/FontFamily'
import { Filters } from './parts/Filters'

const StyleConfig: React.FC = () => {
  return (
    <div>
      <Section label={i18n.t('typography')}>
        <Container>
          <Colors />
          <FontFamily />
        </Container>
      </Section>

      <Section label={i18n.t('filters')}>
        <Filters />
      </Section>
    </div>
  )
}

const Container = styled('div', {
  aboveMedium: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const SectionWrapper = styled('div', {
  backgroundColor: '$g35',
  borderRadius: '$normal',
  padding: '$s25',
  marginBottom: '$s25',
})

const Section: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <>
      <Text css={{ marginBottom: '$s20', marginLeft: '$s25' }}>{label}</Text>
      <SectionWrapper>{children}</SectionWrapper>
    </>
  )
}

export { StyleConfig }
