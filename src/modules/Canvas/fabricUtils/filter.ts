import { fabric } from 'fabric'

import { CanvasElementsSchema } from '.'

const fabricFilters = fabric.Image.filters

const imageFilter = (
  canvas: fabric.Canvas,
  image: fabric.Image,
  data?: CanvasElementsSchema['backgroundFilters']
) => {
  fabric.Object.prototype.transparentCorners = false

  if (!data) {
    return
  }

  /**
   * Filter
   */
  const filterBeApply = data.filters.map(
    (filter) => new fabricFilters[filter.mode](filter.params)
  )
  image.applyFilters(filterBeApply)

  /**
   * Gradients
   */
  data.gradients?.list.forEach((item) => {
    const gradient = new fabric.Gradient({
      coords: {
        x1: data.gradients?.position === 'diagonal' ? canvas?.height ?? 0 : 0,
        x2: 0,
        y1: 0,
        y2: canvas?.height ?? 0,
      },
      colorStops: item,
    })

    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas?.height ?? 0,
      height: canvas?.height ?? 0,
      fill: gradient,
      hasControls: false,
      selectable: false,
      evented: false,
    })

    canvas.add(rect)
    canvas.sendToBack(rect)
  })
}

export { imageFilter }
