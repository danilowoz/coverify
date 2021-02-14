import { CanvasElementsSchema } from 'modules/Canvas/fabricUtils'

import remove from './filter-assets/remove.jpg'
import pixelate from './filter-assets/pixelate.jpg'
import grayscaleGrayscale from './filter-assets/pixelate-grayscale.jpg'
import grayscale from './filter-assets/grayscale.jpg'
import spotifyProfile from './filter-assets/spotify-profile.png'
import spotify1 from './filter-assets/spotify.jpg'
import spotify2 from './filter-assets/spotify2.jpg'
import spotify3 from './filter-assets/spotify3.jpg'
import spotify4 from './filter-assets/spotify4.jpg'
import spotify5 from './filter-assets/spotify5.jpg'
import spotify6 from './filter-assets/spotify6.jpg'
import spotify7 from './filter-assets/spotify7.jpg'
import spotify8 from './filter-assets/spotify8.png'
import spotify9 from './filter-assets/spotify9.png'

type Schema = {
  name: string
  preview: string
  data: CanvasElementsSchema['backgroundFilters']
}[]

const FILTER_OPTIONS: Schema = [
  {
    name: 'Remove filter',
    preview: remove,
    data: {
      filters: [],
    },
  },
  {
    name: 'Pixelate',
    preview: pixelate,
    data: {
      filters: [
        {
          mode: 'Pixelate',
          params: { blocksize: 60 },
        },
      ],
    },
  },
  {
    name: 'Pixelate + Grayscale',
    preview: grayscaleGrayscale,
    data: {
      filters: [
        {
          mode: 'Pixelate',
          params: { blocksize: 60 },
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
      ],
    },
  },
  {
    name: 'Grayscale',
    preview: grayscale,
    data: {
      filters: [
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
      ],
    },
  },
  {
    name: 'Profile',
    preview: spotifyProfile,
    data: {
      gradients: {
        position: 'diagonal',
        list: [
          [
            {
              offset: '.5',
              color: 'rgba(54, 91, 141, .1)',
            },
            {
              offset: '1',
              color: 'rgba(54, 91, 141, .4)',
            },
          ],
          [
            {
              offset: '0',
              color: 'rgba(224, 93, 142, .9)',
            },
            {
              offset: '.5',
              color: 'rgba(54, 91, 141, .3)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'BlendColor',
          params: { color: '#365B8D', mode: 'lighten', alpha: 0.4 },
        },
      ],
    },
  },
  {
    name: 'I',
    preview: spotify1,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'transparent',
            },
            {
              offset: '1',
              color: 'rgba(235, 106, 70, .8)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'Brightness',
          params: { brightness: 0.3 },
        },
        {
          mode: 'BlendColor',
          params: { color: '#1db954', mode: 'lighten', alpha: 0.4 },
        },
      ],
    },
  },
  {
    name: 'II',
    preview: spotify2,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'transparent',
            },
            {
              offset: '1',
              color: 'rgba(243, 196, 97, .95)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Polaroid' as any,
          params: undefined,
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'BlendColor',
          params: { color: '#F3C461', mode: 'screen', alpha: 0.2 },
        },
        {
          mode: 'BlendColor',
          params: { color: '#005A20', mode: 'screen', alpha: 0.6 },
        },
      ],
    },
  },
  {
    name: 'III',
    preview: spotify3,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'transparent',
            },
            {
              offset: '1',
              color: 'rgba(31, 130, 91, .7)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Brightness',
          params: { brightness: 0.2 },
        },
        {
          mode: 'Contrast',
          params: { contrast: 0.4 },
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'BlendColor',
          params: { color: '#F3C461', mode: 'multiply', alpha: 0.4 },
        },
      ],
    },
  },
  {
    name: 'IV',
    preview: spotify4,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'rgba(237, 135, 169, .7)',
            },
            {
              offset: '1',
              color: 'rgba(194, 229, 196, .7)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Brightness',
          params: { brightness: 0.2 },
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
      ],
    },
  },
  {
    name: 'V',
    preview: spotify5,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '.5',
              color: 'transparent',
            },
            {
              offset: '1',
              color: 'rgba(102, 179, 255, .4)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Brightness',
          params: { brightness: 0.2 },
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'BlendColor',
          params: { color: '#66B3FF', mode: 'multiply', alpha: 0.4 },
        },
      ],
    },
  },
  {
    name: 'VI',
    preview: spotify6,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'transparent',
            },
            {
              offset: '1',
              color: 'rgba(255, 55, 239, .4)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Brightness',
          params: { brightness: 0.05 },
        },
        {
          mode: 'BlendColor',
          params: { color: '#FF37EF', mode: 'lighten', alpha: 0.2 },
        },
      ],
    },
  },
  {
    name: 'VII',
    preview: spotify7,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '0',
              color: 'rgba(215, 14, 95, .3)',
            },
            {
              offset: '1',
              color: 'rgba(255, 239, 156, .6)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Contrast',
          params: { contrast: 0.2 },
        },
      ],
    },
  },
  {
    name: 'VIII',
    preview: spotify8,
    data: {
      gradients: {
        list: [
          [
            {
              offset: '.2',
              color: 'rgba(0, 0, 0, .0)',
            },
            {
              offset: '1',
              color: 'rgba(0, 0, 0, 1)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Contrast',
          params: { contrast: 0.2 },
        },
        {
          mode: 'Grayscale',
          params: { mode: 'average' },
        },
        {
          mode: 'BlendColor',
          params: { color: '#FB7A00', mode: 'tint', alpha: 0.3 },
        },
      ],
    },
  },
  {
    name: 'IX',
    preview: spotify9,
    data: {
      gradients: {
        position: 'diagonal',
        list: [
          [
            {
              offset: '1',
              color: 'rgba(0, 255, 232, .1)',
            },
            {
              offset: '0',
              color: 'rgba(212, 254, 129, .5)',
            },
          ],
        ],
      },
      filters: [
        {
          mode: 'Contrast',
          params: { contrast: 0.2 },
        },
      ],
    },
  },
]

export { FILTER_OPTIONS }
