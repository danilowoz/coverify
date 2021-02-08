import React from 'react'
import { motion } from 'framer-motion'

import { styled, Text } from 'common/UI'
import { useAppDispatch } from 'services/state'
import { canvasActions } from 'modules/Canvas'

import { FILTER_OPTIONS } from './filters-options'

const Filters: React.FC = () => {
  const dispatch = useAppDispatch()

  return (
    <Grid>
      {FILTER_OPTIONS.map((filter) => {
        return (
          <Button
            whileTap={{ scale: 0.95 }}
            key={filter.name}
            onClick={() =>
              dispatch(canvasActions.putBackgroundFilter(filter.data))
            }
          >
            <Image style={{ backgroundImage: `url(${filter.preview})` }} />
            <Name>{filter.name}</Name>
          </Button>
        )
      })}
    </Grid>
  )
}

const Grid = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',

  '&:after': {
    content: "''",
    width: '100%',

    aboveSmall: {
      width: 'calc((100% / 2) - .6em)',
    },

    aboveMedium: {
      width: 'calc((100% / 5) - (.6em * 2))',
    },
  },

  '> *': {
    width: 'calc((100% / 2) - .6em)',

    aboveMedium: {
      width: 'calc((100% / 5) - (.6em * 2))',
    },
  },
})

const Button = styled(motion.button, {
  display: 'block',
})

const Image = styled('div', {
  width: '100%',
  paddingBottom: '100%',
  backgroundSize: 'cover',
  borderRadius: '$normal',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `0 7.9px 1.1px -9px rgba(0, 0, 0, 0.165),
  0 12px 20px -9px rgba(0, 0, 0, 0.33)`,
})

const Name = styled(Text, {
  padding: '$s20',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export { Filters }
