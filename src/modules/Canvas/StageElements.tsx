import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { styled } from 'common/UI'
import { useAppDispatch } from 'services/state'
import { canvasActions } from 'modules/Canvas'
import { webFontUrlFormat } from 'common/utils/webFontUrlFormat'
import { fetchPromiseStylesheet } from 'common/utils/fetchPromiseStylesheet'

import {
  CanvasElementsSchema,
  initCanvasFabricJs,
  resizeElements,
} from './fabricUtils'

const ResponsiveWrapper = styled('div', {
  width: '100%',

  canvas: {
    borderRadius: '$normal',
  },
  'canvas:last-child': {
    boxShadow: '0 5px 8.7px #110d0d',
  },
})

const CanvasElement = styled('canvas', {
  width: '28em',
  height: '28em',
})

type Ref = {
  getInstance: () => {
    fabric?: fabric.Canvas
    canvas?: HTMLCanvasElement | null
  }
}
type Props = {
  data: CanvasElementsSchema
  onCanvasChange: (newContent: CanvasElementsSchema) => void
  shouldRefreshCanvas: boolean
}

const StageElements = forwardRef<Ref, Props>(function StageElementsForwarded(
  { data, onCanvasChange, shouldRefreshCanvas },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas>()
  const dispatch = useAppDispatch()

  useDeepCompareEffect(
    function createCanvas() {
      function destroyCanvas() {
        fabricRef.current?.dispose()
        fabricRef.current = undefined
      }

      if (shouldRefreshCanvas) {
        /**
         * * Keep this guy here
         * It shouldn't be fired in the
         * component did mount, as this instance depends
         * even when the components is not there anymore
         */
        destroyCanvas()

        fetchPromiseStylesheet(
          webFontUrlFormat(data.typeConfig.fontFamily)
        ).then(() => {
          fabricRef.current = initCanvasFabricJs({
            canvas: canvasRef.current,
            container: containerRef.current,
            content: data,
            onAnyChange: onCanvasChange,
          })

          dispatch(canvasActions.setRefreshCanvasOff())
        })
      }
    },
    [data, shouldRefreshCanvas]
  )

  useEffect(function canvasEvents() {
    const resize = () => resizeElements(containerRef.current, fabricRef.current)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getInstance: () => ({
      canvas: canvasRef.current,
      fabric: fabricRef.current,
    }),
  }))

  return (
    <>
      <ResponsiveWrapper ref={containerRef}>
        <CanvasElement ref={canvasRef} />
      </ResponsiveWrapper>
    </>
  )
})

export { StageElements }
