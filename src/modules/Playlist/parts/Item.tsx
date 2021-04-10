import React from 'react'

import { styled, Text, usePrompt } from 'common/UI'
import { RootState, useAppDispatch, useAppSelector } from 'services/state'
import i18n from 'services/i18n'
import { canvasActions, canvasSelector } from 'modules/Canvas'

import emptyAlbumSrc from '../assets/white-album.png'

interface Props {
  data: Unpacked<RootState['playlist']['data']>
  editing: boolean
}

const Item: React.FC<Props> = ({ data, editing }) => {
  const dispatch = useAppDispatch()
  const hasPendingChanges = useAppSelector(canvasSelector.configSave) === false
  const playlistIdActive = useAppSelector(canvasSelector.playlistId)

  const itemId = data?.id ?? ''
  const prompt = usePrompt({
    id: itemId,
    onConfirm: () => dispatch(canvasActions.setPlaylist(itemId)),
  })

  const handleClick = () => {
    if (itemId === playlistIdActive) {
      return
    }

    if (hasPendingChanges) {
      prompt({ message: i18n.t('discardChanges'), id: itemId })
    } else {
      dispatch(canvasActions.setPlaylist(itemId))
    }
  }

  return (
    <Wrapper onClick={handleClick}>
      <Image
        style={{
          backgroundImage: `url(${data?.images?.[0]?.url ?? emptyAlbumSrc})`,
        }}
      >
        <ActiveState highlight={editing} />
        {editing && (
          <EditingWrapper>
            <EditingContainer>
              <svg width="621" height="621" viewBox="0 0 621 621">
                <g
                  stroke="#fff"
                  strokeWidth="14"
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    strokeLinejoin="round"
                    d="M439.9 70.084L550.918 181.1 241.91 490.106 130.895 379.09z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M122.736 533.998l-56.569 20.835 64.728-175.744L241.91 490.105l-89.835 33.087"
                  />
                  <path
                    d="M530.057 40.032l50.911 50.911c16.598 16.598 16.598 43.507 0 60.104L550.916 181.1h0L439.901 70.084l30.052-30.052c16.597-16.598 43.506-16.598 60.104 0z"
                    strokeLinejoin="round"
                  />
                  <path
                    strokeLinecap="round"
                    d="M183.22 381.21l181.727-181.726M402.425 162.715l28.284-28.992"
                  />
                </g>
              </svg>
              <Text size="small">{i18n.t('editing')}</Text>
            </EditingContainer>
          </EditingWrapper>
        )}
      </Image>

      <Name>{data?.name}</Name>
    </Wrapper>
  )
}

const Wrapper = styled('button', {
  textAlign: 'left',
  marginBottom: '$s10',
})

const ActiveState = styled('div', {
  borderRadius: '$normal',

  borderWidth: '4px',
  borderStyle: 'solid',
  borderColor: 'transparent',

  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,

  variants: {
    highlight: {
      true: {
        borderColor: '$brand50',
      },
    },
  },
})

const Image = styled('div', {
  width: '100%',
  paddingBottom: '100%',
  backgroundSize: 'cover',
  borderRadius: '$normal',
  position: 'relative',
  overflow: 'hidden',
})

const EditingWrapper = styled('div', {
  bottom: 0,
  display: 'flex',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
})

const EditingContainer = styled('div', {
  textAlign: 'center',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  height: '30%',
  width: '30%',
  margin: 'auto',

  position: 'relative',

  '&:before': {
    content: "''",
    backgroundColor: '$g50',
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    opacity: '.8',
  },

  '*': {
    position: 'relative',
  },

  svg: {
    width: '30%',
    height: '30%',
    marginBottom: '$s5',
  },
})

const Name = styled(Text, {
  padding: '$s20',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export { Item }
