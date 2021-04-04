import React, { useEffect, useMemo, useState } from 'react'

import { SearchInput, styled, Text } from 'common/UI'
import i18n from 'services/i18n'
import { useAppDispatch, useAppSelector } from 'services/state'
import { canvasActions, canvasSelector } from 'modules/Canvas'
import { webFontUrlFormat } from 'common/utils/webFontUrlFormat'
import { fetchPromiseStylesheet } from 'common/utils/fetchPromiseStylesheet'

import { FONTS } from './fonts-options'

const ALL = i18n.t('allCategories') as string

const FontFamily: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categorySelected, setCategorySelected] = useState(ALL)

  const dispatch = useAppDispatch()
  const currentFontFamily = useAppSelector(canvasSelector.currentFontFamily)

  const handleHandle = (font: string) => {
    dispatch(canvasActions.putFontFamily(font))
  }

  const formatFonts = useMemo(() => {
    return FONTS.map((f) => ({
      ...f,
      category: f.category.charAt(0).toUpperCase() + f.category.slice(1),
    }))
  }, [])

  const filterList = useMemo(() => {
    return formatFonts?.filter((e) => {
      if (searchQuery === '' && categorySelected === ALL) {
        return true
      }

      const term = searchQuery.toLowerCase()
      const categoryFilter = categorySelected
        ? e.category === categorySelected
        : true

      return e.family?.toLowerCase().indexOf(term) !== -1 && categoryFilter
    })
  }, [categorySelected, formatFonts, searchQuery])

  const fontCategories = useMemo(() => {
    return formatFonts
      .reduce<string[]>((acc, curr) => {
        if (acc.includes(curr.category)) {
          return acc
        }

        return [...acc, curr.category]
      }, [])
      .sort()
  }, [formatFonts])

  useEffect(() => {
    FONTS.map((font) => {
      fetchPromiseStylesheet(webFontUrlFormat(font.family))
    })
  }, [])

  return (
    <Wrapper>
      <Form>
        <SearchInput
          type="search"
          value={searchQuery}
          onChange={(event) => {
            event.preventDefault()
            setSearchQuery(event.target.value)
          }}
          placeholder={i18n.t('searchPlaceholder')}
          css={{ marginTop: 0, marginBottom: '1.75em' }}
        />

        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <Select onChange={(event) => setCategorySelected(event.target.value)}>
          <option value={ALL}>{ALL}</option>
          {fontCategories.map((category) => {
            return (
              <option value={category} key={category}>
                {category}
              </option>
            )
          })}
        </Select>
      </Form>

      <ScrollView>
        {filterList.map((font) => {
          return (
            <Item key={font.family} onClick={() => handleHandle(font.family)}>
              <Text
                size="big"
                css={{ marginRight: '$s5' }}
                style={{ fontFamily: font.family }}
                color={font.family === currentFontFamily ? 'brand' : 'g00'}
              >
                Abcdefgh
              </Text>
              <Text size="small" color="g30">
                {font.family}
              </Text>
            </Item>
          )
        })}
      </ScrollView>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  minWidth: '34%',
  '@bellowMedium': {
    marginTop: '$s50',
  },
})

const Form = styled('form', {
  position: 'relative',

  '&:after': {
    content: "''",
    display: 'block',
    borderRight: '1px solid white',
    borderBottom: '1px solid white',
    width: '.4em',
    height: '.4em',
    transform: 'rotate(45deg)',
    position: 'absolute',
    right: '$s10',
    top: '.9em',
  },
})

const Select = styled('select', {
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 0,
  color: '$g00',
  position: 'absolute',
  top: '0.9em',
  right: '$s20',
  paddingRight: '$s10',
})

const Item = styled('button', {
  display: 'flex',
  marginBottom: '$s20',
  alignItems: 'flex-end',
  lineHeight: 1,
})

const ScrollView = styled('div', {
  flexWrap: 'wrap',
  overflow: 'auto',
  height: '30vh',
  flexDirection: 'row',
  flex: 1,
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  borderTopColor: '$g35',

  marginTop: '$s20',
  paddingTop: '$s20',
})

export { FontFamily }
