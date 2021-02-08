import { fabric } from 'fabric'
import { shallowEqual } from 'react-redux'

import { centeringGuidelines } from './centeringGuidelines'
import { imageFilter } from './filter'

type FabricObject = fabric.Object & {
  fontFamily: string
  fontSize: number
  text: string
}

export interface CanvasElementsSchema {
  typeConfig: {
    fontFamily: string
    fontSize: number
  }
  types: {
    fill: string
    relativeLeft: number
    relativeTop: number
    scaleX: number
    scaleY: number
    text: string
    fontWeight?: string
  }[]
  backgroundFilters: {
    gradients?: {
      position?: 'diagonal' | 'vertical'
      list: fabric.IGradientOptionsColorStops[]
    }
    filters: {
      mode: keyof fabric.IAllFilters
      params:
        | any
        | ConstructorParameters<fabric.IAllFilters[keyof fabric.IAllFilters]>
    }[]
  }
  backgroundColor: string
  backgroundUrl: string
}

/**
 * Initially remove all events and add once again
 */
const setCanvasEvents = (fabricRef: fabric.Canvas | undefined) => {
  if (fabricRef) {
    fabricRef.off('object:moving')
    fabricRef.off('mouse:down')
    fabricRef.off('before:render')
    fabricRef.off('after:render')
    fabricRef.off('mouse:up')

    centeringGuidelines(fabricRef)
  }
}

/**
 * Resize all elements and background proportionally
 */
export const resizeElements = (
  containerRef?: HTMLDivElement | null,
  fabricRef?: fabric.Canvas | undefined
) => {
  const containerSize = containerRef?.getBoundingClientRect()

  if (containerSize && fabricRef && containerRef) {
    const canvasSize = containerSize.width
    const { offsetWidth } = containerRef

    const prevSize = fabricRef.getWidth()
    const sizeFactor = offsetWidth / prevSize
    const canvasElements = fabricRef.getObjects()

    fabricRef.setWidth(canvasSize)
    fabricRef.setHeight(canvasSize)

    canvasElements.forEach((obj) => {
      const scaleX = obj.scaleX ?? 0
      const scaleY = obj.scaleY ?? 0
      const left = obj.left ?? 0
      const top = obj.top ?? 0

      const tempScaleX = scaleX * sizeFactor
      const tempScaleY = scaleY * sizeFactor
      const tempLeft = left * sizeFactor
      const tempTop = top * sizeFactor

      obj.scaleX = tempScaleX
      obj.scaleY = tempScaleY
      obj.left = tempLeft
      obj.top = tempTop

      obj.setCoords()
    })

    setCanvasEvents(fabricRef)

    fabricRef.renderAll()
    fabricRef.calcOffset()
  }

  return
}

/**
 * Given a CanvasElementsSchema insert it in the Canvas
 */
const insertElementsOnCanvas = (
  fabricRef: fabric.Canvas,
  content: CanvasElementsSchema
): void => {
  const { backgroundUrl, types, typeConfig } = content

  const canvasHeight = fabricRef?.height ?? 0
  const canvasWidth = fabricRef?.width ?? 0
  types?.forEach((element) => {
    if (element.text) {
      const type = new fabric.IText(element.text, {
        ...typeConfig,
        fontWeight: element.fontWeight ?? 'normal',
        fill: element.fill,
        hasRotatingPoint: false,
        left: element.relativeLeft * canvasWidth,
        lockRotation: true,
        scaleX: element.scaleX,
        scaleY: element.scaleY,
        text: element.text,
        top: element.relativeTop * canvasHeight,
      })

      fabricRef?.add(type)
    }
  })

  const setBackgroundSize = (width = 0, height = 0): Partial<FabricObject> => {
    const orientation = width > height ? height : width

    const canvasSize = fabricRef?.height ?? 0

    const scaleX = canvasSize / orientation
    const scaleY = canvasSize / orientation

    const top = ((scaleY * height - canvasSize) / 2) * -1
    const left = ((scaleX * width - canvasSize) / 2) * -1

    return { scaleX, scaleY, ...(width > height ? { left } : { top }) }
  }

  fabric.Image.fromURL(
    backgroundUrl,
    (img) => {
      fabricRef.add(img.set(setBackgroundSize(img.width, img.height) as any))
      imageFilter(fabricRef, img, content.backgroundFilters)
      fabricRef.sendToBack(img)
    },
    {
      crossOrigin: 'Anonymous',
      hasControls: false,
      selectable: false,
      evented: false,
    }
  )

  fabricRef?.requestRenderAll()
}

/**
 * Retrieve all elements in a legible way
 */
export const getAllElementsPositions = (
  fabricRef: fabric.Canvas
): CanvasElementsSchema => {
  if (!fabricRef) {
    throw Error("`fabricRef` doesn't exist on `getAllElementsPositions`")
  }

  let typeConfig = { fontFamily: 'sans-serif', fontSize: 20 }
  const canvasHeight = fabricRef?.height ?? 0
  const canvasWidth = fabricRef?.width ?? 0

  const objects = fabricRef.getObjects() as FabricObject[]
  const types = objects.reduce<any>((acc, item) => {
    if (!item.text) {
      return acc
    }

    typeConfig = { fontFamily: item.fontFamily, fontSize: item.fontSize }

    const round = (value: number) => Math.round(value * 1e2) / 1e2

    return [
      ...acc,
      {
        fill: item.fill,
        relativeLeft: round((item.left ?? 0) / canvasWidth),
        relativeTop: round((item.top ?? 0) / canvasHeight),
        scaleX: round(item?.scaleX ?? 0),
        scaleY: round(item?.scaleY ?? 0),
        text: item.text,
        fontWeight: (item as any).fontWeight,
      },
    ]
  }, [])

  const result = {
    typeConfig,
    types,
  }

  return result as CanvasElementsSchema
}

/**
 * Watching with the current canvas
 * has changed, and set it as unsaved
 */
const watchForAnyChanges = (
  fabricRef: fabric.Canvas,
  content: CanvasElementsSchema,
  onAnyChange: (newContent: CanvasElementsSchema) => void
) => {
  fabricRef.off('object:modified')

  const handleChange = () => {
    const newCanvasElements = getAllElementsPositions(fabricRef)
    const isEqual = shallowEqual(content, newCanvasElements)

    if (!isEqual) {
      onAnyChange(newCanvasElements)
    }
  }

  fabricRef.on('object:modified', handleChange)
}

/**
 * Create a Fabric canvas and set its proper property
 */
type Props = {
  canvas: HTMLCanvasElement | null
  container: HTMLDivElement | null
  content: CanvasElementsSchema
  onAnyChange: (newContent: CanvasElementsSchema) => void
}

export const initCanvasFabricJs = ({
  canvas,
  container,
  content,
  onAnyChange,
}: Props) => {
  if (canvas) {
    const fabricInstance = new fabric.Canvas(canvas, {
      height: 300,
      width: 300,
    })
    /**
     * Should be fired first, in order to calc
     * the relative measures right
     */
    resizeElements(container, fabricInstance)

    insertElementsOnCanvas(fabricInstance, content)
    watchForAnyChanges(fabricInstance, content, onAnyChange)

    setCanvasEvents(fabricInstance)

    return fabricInstance
  } else {
    throw Error("`canvasRef` doesn't exist on `initCanvasFabricJs`")
  }
}
