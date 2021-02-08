import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import Snuggle from 'react-snuggle'

import { Button, SearchInput, styled } from 'common/UI'
import i18n from 'services/i18n'
import { BackgroundImageItem } from 'pages/api/vendor/editor/search-images'
import { useAppDispatch, useAppSelector } from 'services/state'
import { canvasActions } from 'modules/Canvas'

import { useBackgrounds } from './hooks'
import { backgroundsStateActions } from './state'
import { Loading } from './parts/Loading'
import { Empty } from './parts/Empty'
import { Item } from './parts/Item'

const Wrapper = styled('div', {
  textAlign: 'center',
})

const Container = styled('div', {
  marginBottom: '$s30',
  width: '100%',
})

const Backgrounds: React.FC = () => {
  const initialQuery = useAppSelector(
    (data) => data.backgrounds.pagination.query
  )
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchQueryDebounced] = useDebounce(searchQuery, 600)

  const dispatch = useAppDispatch()
  const { data, loading, getMore, hasMoreItems } = useBackgrounds()

  const pickImage = (element: BackgroundImageItem) => {
    if (element.urls?.full && element.color) {
      dispatch(
        canvasActions.putBackground({
          url: element.urls?.regular,
          color: element.color,
        })
      )
    }
  }

  useEffect(
    function updateQuery() {
      // Prevent unnecessary requests
      if (initialQuery !== searchQueryDebounced) {
        dispatch(backgroundsStateActions.setQuery(searchQueryDebounced))
      }
    },
    [dispatch, initialQuery, searchQueryDebounced]
  )

  return (
    <Wrapper>
      <SearchInput
        type="search"
        value={searchQuery}
        onChange={(event) => {
          event.preventDefault()
          setSearchQuery(event.target.value)
        }}
        placeholder={i18n.t('searchPlaceholder')}
      />

      <Container>
        <Snuggle>
          {data.map((element) => {
            return (
              <Item key={element.id} element={element} pickImage={pickImage} />
            )
          })}
        </Snuggle>
      </Container>

      {!loading && data.length === 0 && (
        <Empty
          onClickRandomWord={() =>
            dispatch(backgroundsStateActions.setRandomQuery())
          }
        />
      )}

      {!loading && hasMoreItems && (
        <Button onClick={getMore}>{i18n.t('loadMore')}</Button>
      )}

      {loading && <Loading />}
    </Wrapper>
  )
}

export { Backgrounds }
