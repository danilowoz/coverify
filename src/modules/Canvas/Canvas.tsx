import React, { useCallback, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { shallowEqual } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'

import { useAppDispatch, useAppSelector } from 'services/state'
import { styled, Tag, Text } from 'common/UI'
import i18n from 'services/i18n'
import { useUser } from 'services/authentication'

import {
  useSavePlaylist,
  useRetrieveSchemaFromServer,
  useDeletePlaylist,
} from './hooks'
import { canvasSelector, canvasActions } from './state'
import exportSrc from './assets/export.svg'
import { ReactComponent as SpotifyLogo } from './assets/spotify.svg'
import loadingSrc from './assets/loading.svg'
import { ReactComponent as TrashIcon } from './assets/trash.svg'
import { ReactComponent as DownloadLogo } from './assets/download.svg'
import { CanvasElementsSchema, getAllElementsPositions } from './fabricUtils'
import { StageElements } from './StageElements'

const Canvas: React.FC = () => {
  /**
   * Local states
   */
  const [loading, setLoading] = useState(false)
  const fabricRef = useRef<fabric.Canvas>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const setRef = useCallback((node) => {
    fabricRef.current = node?.getInstance().fabric
    canvasRef.current = node?.getInstance().canvas
  }, [])

  /**
   * Store
   */
  const isLogged = useUser()
  const dispatch = useAppDispatch()
  const canvasState = useAppSelector(canvasSelector.data, shallowEqual)
  const canvasOriginalState = useAppSelector((store) => store.canvas.data)
  const isSaved = useAppSelector(canvasSelector.configSave)
  const canvasShouldRefresh = useAppSelector(
    (store) => store.canvas.config.shouldRefreshCanvas
  )
  const currentPlaylist = useAppSelector(({ playlist, canvas }) => {
    return playlist.data?.find((item) => item.id === canvas.config.playlistId)
  })

  /**
   * Render helpers
   */
  const tagStatus = () => {
    if (isSaved === true) {
      return <Tag variant="success">{i18n.t('saved')}</Tag>
    }

    if (isSaved === false) {
      return <Tag variant="warning">{i18n.t('draft')}</Tag>
    }

    return <Tag variant="neutral">{i18n.t('draft')}</Tag>
  }

  const loadingButtonAnimation = {
    exit: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  }

  /**
   * Handlers
   */
  const uploadCoverData = useSavePlaylist()
  const getImage = (): string | false => {
    if (fabricRef.current && canvasRef.current) {
      // Remove selection
      fabricRef.current.discardActiveObject().renderAll()

      const jpegImage = canvasRef.current
        .toDataURL('image/jpeg', 0.5)
        .replace(/^data:image\/jpeg;base64,/, '')

      return jpegImage
    }

    return false
  }

  const saveCover = async () => {
    const jpegImage = getImage()

    if (fabricRef.current && canvasRef.current && jpegImage) {
      setLoading(true)

      const canvasContent = getAllElementsPositions(fabricRef.current)

      await uploadCoverData(
        {
          ...canvasContent,
          backgroundFilters: canvasOriginalState.backgroundFilters,
          backgroundColor: canvasOriginalState.backgroundColor,
          backgroundUrl: canvasOriginalState.backgroundUrl,
        },
        jpegImage
      )

      setLoading(false)
    }
  }

  const downloadCover = async (fileName = 'Playlist') => {
    const jpegImage = getImage()

    if (jpegImage) {
      const a = document.createElement('a')
      a.href = `data:application/octet-stream;base64,${jpegImage}`
      a.download = `${fileName} - getcoverify.com.jpg`
      a.click()
    }
  }

  const deleteCanvas = useDeletePlaylist()

  const onCanvasChange = useCallback(
    (newContent: Pick<CanvasElementsSchema, 'typeConfig' | 'types'>) => {
      dispatch(canvasActions.putTypes(newContent))
    },
    [dispatch]
  )

  useRetrieveSchemaFromServer()

  return (
    <>
      <StageElements
        ref={setRef}
        data={canvasState}
        onCanvasChange={onCanvasChange}
        shouldRefreshCanvas={canvasShouldRefresh}
      />

      <Wrapper>
        {isLogged && (
          <Flex>
            <Text css={{ marginBottom: '$s10' }} size="small" uppercase>
              {i18n.t('editingPlaylist')}
            </Text>

            <div>{tagStatus()}</div>
          </Flex>
        )}

        <Text size="bigger" bold>
          {isLogged ? currentPlaylist?.name : 'Coverify'}
        </Text>
        <Text css={{ opacity: 0.6, marginTop: '$s5' }}>
          {currentPlaylist?.description || i18n.t('descriptionFallback')}
        </Text>

        <GroupButtons>
          <MainButton
            onClick={saveCover}
            animate={{ opacity: isLogged ? 1 : 0.4 }}
            as={motion.button}
            disabled={!isLogged}
          >
            <AnimatePresence>
              {loading && (
                <motion.img
                  {...loadingButtonAnimation}
                  initial={{ opacity: 0 }}
                  src={loadingSrc}
                  alt="Loading"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!loading && (
                <motion.img
                  {...loadingButtonAnimation}
                  initial={{ opacity: 1 }}
                  src={exportSrc}
                  alt="Export"
                />
              )}
            </AnimatePresence>

            {i18n.t('updateOnSpotify')}
          </MainButton>

          <GroupButtons>
            <CircularButton
              brand
              as="button"
              onClick={() => downloadCover(currentPlaylist?.name)}
            >
              <DownloadLogo viewBox="0 0 23 23" style={{ width: '1.2em' }} />
            </CircularButton>

            <CircularButton
              href={currentPlaylist?.uri}
              css={{ marginRight: '$s10', marginLeft: '$s10' }}
              animate={{ opacity: isLogged ? 1 : 0.4 }}
              as={motion.a}
            >
              <SpotifyLogo viewBox="0 0 26 26" style={{ width: '1.4em' }} />
            </CircularButton>

            <CircularButton
              animate={{ opacity: isSaved !== undefined ? 1 : 0.4 }}
              as={motion.button}
              onClick={deleteCanvas}
              disabled={!isLogged}
            >
              <TrashIcon viewBox="0 0 23 23" style={{ width: '1.1em' }} />
            </CircularButton>
          </GroupButtons>
        </GroupButtons>
      </Wrapper>
    </>
  )
}

const Wrapper = styled('div', {
  marginTop: '$s45',
})

const Flex = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const GroupButtons = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
})

const MainButton = styled('button', {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$brand50',
  borderRadius: '$big',

  paddingLeft: '$s10',
  paddingRight: '$s10',
  paddingTop: '$s5',
  paddingBottom: '$s5',
  marginTop: '$s45',

  fontSize: '$5',
  backgroundColor: '#55555513',
  transition: 'background',

  display: 'flex',
  alignItems: 'center',
  position: 'relative',

  '&:hover': {
    backgroundColor: '#55555590',
  },

  '@aboveMedium': {
    paddingLeft: '$s50',
    paddingRight: '$s30',
    paddingTop: '$s10',
    paddingBottom: '$s10',
  },

  img: {
    display: 'none',
    marginRight: '$s10',
    height: '1.3em',
    width: '1.3em',
    position: 'absolute',
    left: '$s20',

    '@aboveMedium': {
      display: 'block',
    },
  },
})

const CircularButton = styled('a', {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$g00',
  borderRadius: '$big',

  marginTop: '$s20',

  color: '$g00',

  minWidth: '2em',
  height: '2em',

  '@aboveMedium': {
    minWidth: '2.75em',
    height: '2.75em',
    marginTop: '$s50',
  },

  display: 'flex',
  transition: 'all',

  '&:hover': {
    backgroundColor: '#55555590',
  },

  variants: {
    brand: {
      true: {
        borderColor: '$brand50',
      },
    },
  },

  '*': {
    width: '60%',
    margin: 'auto',
  },
})

export { Canvas }
