import { motion } from 'framer-motion'
import React from 'react'

import { styled, Text } from 'common/UI'
import { APP_NAME } from 'common/constants'
import i18n from 'services/i18n'
import { BackgroundImageItem } from 'pages/api/vendor/editor/search-images'

import { useDownloadImage } from '../hooks'

interface ItemProps {
  element: BackgroundImageItem
  pickImage: (element: BackgroundImageItem) => void
}

const Item: React.FC<ItemProps> = ({ element, pickImage }) => {
  const download = useDownloadImage()

  const handleClick = () => {
    if (element.id) {
      pickImage(element)
      download(element.id)
    }
  }

  return (
    <motion.button
      key={element.id}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src={element?.urls?.small}
        alt={element?.alt_description}
        width={element.width}
        height={element.height}
      />

      <Copyright color="g00" size="small">
        {i18n.t('photoBy')}{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${element?.user?.links?.html}?utm_source=${APP_NAME}&utm_medium=referral`}
        >
          {element?.user?.name}
        </a>{' '}
        {i18n.t('photoByOn')}{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://unsplash.com/?utm_source=${APP_NAME}&utm_medium=referral`}
        >
          Unsplash
        </a>
      </Copyright>
    </motion.button>
  )
}

const Image = styled('img', {
  boxShadow: `0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07)`,
  borderRadius: '2px',
  width: '100%',
  height: 'auto',
})

const Copyright = styled(Text, {
  textAlign: 'left',
  marginTop: '$s5',

  a: {
    textDecoration: 'underline',
    color: 'inherit',

    '&:hover': {
      textDecoration: 'none',
    },
  },
})

export { Item }
