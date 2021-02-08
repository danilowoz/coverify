import { fabric } from 'fabric'

export const centeringGuidelines = (canvas: fabric.Canvas) => {
  const canvasWidth = canvas.getWidth()
  const canvasHeight = canvas.getHeight()

  const canvasWidthCenter = canvasWidth / 2
  const canvasHeightCenter = canvasHeight / 2

  const topMap: Record<number, boolean> = {}
  const leftMap: Record<number, boolean> = {}
  const rightMap: Record<number, boolean> = {}
  const bottomMap: Record<number, boolean> = {}
  const widthCenterMap: Record<number, boolean> = {}
  const heightCenterMap: Record<number, boolean> = {}

  const marginOffset = canvasWidth * 0.07
  const offset = 7
  const centerLineColor = '#1db954'
  const centerLineWidth = 1

  const ctx = canvas.getSelectionContext()
  let viewportTransform: number[] = []

  // Width center
  for (
    let i = canvasWidthCenter - offset, len = canvasWidthCenter + offset;
    i <= len;
    i++
  ) {
    widthCenterMap[Math.round(i)] = true
  }

  // Height center
  for (
    let i = canvasHeightCenter - offset, len = canvasHeightCenter + offset;
    i <= len;
    i++
  ) {
    heightCenterMap[Math.round(i)] = true
  }

  // Margin mapping
  for (let i = 0, len = marginOffset; i <= len; i++) {
    topMap[Math.round(i)] = true
  }

  // Left mapping
  for (let i = 0, len = marginOffset; i <= len; i++) {
    leftMap[Math.round(i)] = true
  }

  // Right mapping
  for (
    let i = canvasWidth - marginOffset, len = canvasWidth + marginOffset;
    i <= len;
    i++
  ) {
    rightMap[Math.round(i)] = true
  }

  // Bottom mapping
  for (
    let i = canvasHeight - marginOffset, len = canvasHeight + marginOffset;
    i <= len;
    i++
  ) {
    bottomMap[Math.round(i)] = true
  }

  const showCenterLine = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.save()
    ctx.strokeStyle = centerLineColor
    ctx.lineWidth = centerLineWidth
    ctx.beginPath()
    ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3])
    ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3])
    ctx.stroke()
    ctx.restore()
  }

  let isInVerticalCenter = false
  let isInHorizontalCenter = false
  let isInTop = false
  let isInLeft = false
  let isInRight = false
  let isInBottom = false

  canvas.on('mouse:down', () => {
    if (canvas.viewportTransform) {
      viewportTransform = canvas.viewportTransform
    }
  })

  canvas.on('object:moving', (e) => {
    const object = e.target

    if (!object) {
      return null
    }

    const { x, y } = object.getCenterPoint()
    const { height, width } = object.getBoundingRect()

    isInVerticalCenter = widthCenterMap[Math.round(x)]
    isInHorizontalCenter = heightCenterMap[Math.round(y)]

    isInTop = topMap[Math.round(y - height / 2)]
    isInLeft = leftMap[Math.round(x - width / 2)]
    isInRight = rightMap[Math.round(x + width / 2)]
    isInBottom = bottomMap[Math.round(y + height / 2)]

    if (
      isInTop ||
      isInLeft ||
      isInBottom ||
      isInRight ||
      isInHorizontalCenter ||
      isInVerticalCenter
    ) {
      object.setPositionByOrigin(
        new fabric.Point(
          isInLeft
            ? marginOffset + width / 2
            : isInRight
            ? canvasWidth - marginOffset - width / 2
            : isInVerticalCenter
            ? canvasWidthCenter
            : x,
          isInTop
            ? marginOffset + height / 2
            : isInBottom
            ? canvasHeight - marginOffset - height / 2
            : isInHorizontalCenter
            ? canvasHeightCenter
            : y
        ),
        'center',
        'center'
      )
    }

    return
  })

  canvas.on('before:render', () => {
    canvas.clearContext((canvas as any).contextTop)
  })

  canvas.on('after:render', () => {
    if (isInTop) {
      showCenterLine(0, marginOffset, canvasWidth, marginOffset)
    }

    if (isInBottom) {
      showCenterLine(
        0,
        canvasHeight - marginOffset,
        canvasWidth,
        canvasHeight - marginOffset
      )
    }

    if (isInLeft) {
      showCenterLine(marginOffset, 0, marginOffset, canvasHeight)
    }

    if (isInRight) {
      showCenterLine(
        canvasWidth - marginOffset,
        0,
        canvasWidth - marginOffset,
        canvasHeight
      )
    }

    if (isInVerticalCenter) {
      showCenterLine(
        canvasWidthCenter + 0.5,
        0,
        canvasWidthCenter + 0.5,
        canvasHeight
      )
    }

    if (isInHorizontalCenter) {
      showCenterLine(
        0,
        canvasHeightCenter + 0.5,
        canvasWidth,
        canvasHeightCenter + 0.5
      )
    }
  })

  // clear these values, to stop drawing guidelines once mouse is up
  canvas.on('mouse:up', () => {
    isInVerticalCenter = false
    isInHorizontalCenter = false
    isInTop = false
    isInLeft = false
    isInRight = false
    isInBottom = false

    canvas.renderAll()
  })
}
