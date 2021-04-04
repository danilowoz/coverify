import React, { useState } from 'react'
import { useDebounce } from 'use-debounce'

import { SearchInput } from 'common/UI/SearchInput'
import i18n from 'services/i18n'
import { Button, styled, Text } from 'common/UI'
import { useUser } from 'services/authentication'
import { useAppSelector } from 'services/state'
import { canvasSelector } from 'modules/Canvas'

import { usePlaylists } from './hooks'
import { Welcome } from './parts/Welcome'
import { Loading } from './parts/Loading'
import { Item } from './parts/Item'

const Playlist: React.FC = () => {
  const user = useUser()
  const { loading, data, hasMoreItems, getMore } = usePlaylists()
  const [searchQuery, setSearchQuery] = useState('')
  const playlistIdSelected = useAppSelector(canvasSelector.playlistId)

  const [searchQueryDebounced] = useDebounce(searchQuery, 300)

  const filterPlaylist = data?.filter((e) => {
    if (searchQueryDebounced === '') {
      return true
    }

    return (
      e.name
        ?.toLocaleLowerCase()
        .indexOf(searchQueryDebounced.toLowerCase()) !== -1
    )
  })

  const renderContent = () => {
    if (!user) {
      return <Welcome />
    }

    if (loading && filterPlaylist.length === 0) {
      return <Loading />
    }

    if (filterPlaylist.length === 0 && !hasMoreItems) {
      return (
        <Wrapper>
          <Text css={{ marginTop: '$s25' }}>{i18n.t('alert.noPlaylist')}</Text>
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <Grid>
          {filterPlaylist?.map((item) => (
            <Item
              editing={item.id === playlistIdSelected}
              key={item.id}
              data={item}
            />
          ))}
        </Grid>

        {!loading && hasMoreItems && (
          <Button onClick={getMore}>{i18n.t('loadMore')}</Button>
        )}
        {loading && <Loading />}
      </Wrapper>
    )
  }

  return (
    <>
      <SearchInput
        type="search"
        value={searchQuery}
        onChange={(event) => {
          event.preventDefault()
          setSearchQuery(event.target.value)
        }}
        placeholder={i18n.t('searchPlaceholder')}
      />

      {renderContent()}
    </>
  )
}

const Wrapper = styled('div', {
  textAlign: 'center',
})

const Grid = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',

  '&:after': {
    content: "''",
    width: '100%',

    '@aboveSmall': {
      width: 'calc((100% / 2) - .6em)',
    },

    '@aboveMedium': {
      width: 'calc((100% / 3) - (.6em * 2))',
    },
  },

  '> *': {
    width: 'calc((100% / 2) - .6em)',

    '@aboveMedium': {
      width: 'calc((100% / 3) - (.6em * 2))',
    },
  },
})

export { Playlist }
