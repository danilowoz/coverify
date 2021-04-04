import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { styled } from '../Layout'
import { Text } from '../Text'

const RelativeContext = styled('div', {
  position: 'relative',
  display: 'flex',
})

const Wrapper = styled(motion.div, {
  backgroundColor: '$g50',
  borderRadius: '$normal',
  boxShadow: '0 5px 15px 0 rgba(0,0,0,0.25)',
  minWidth: '15em',
  paddingLeft: '$s30',
  paddingRight: '$s30',
  paddingTop: '$s30',
  position: 'absolute',
  right: '-1.7em',
  top: '3.7em',
})

const buttonStyle = {
  marginBottom: '$s30',
  display: 'block',
  transition: 'color',
  color: 'inherit',
  textDecoration: 'none',

  '&:hover': {
    opacity: '.7',
  },
}

const Button = styled('button', buttonStyle)
const ButtonLink = styled('a', buttonStyle)

const Separator = styled('div', {
  marginBottom: '$s30',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: '$g35',
})

const Context = createContext<{
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: boolean
}>({ dispatch: () => null, state: {} } as any)

const Menu: React.FC = ({ children }) => {
  const [state, setState] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setState(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <RelativeContext ref={wrapperRef}>
      <Context.Provider
        value={{
          open: () => setState(true),
          close: () => setState(true),
          toggle: () => setState((p) => !p),
          isOpen: state,
        }}
      >
        {children}
      </Context.Provider>
    </RelativeContext>
  )
}

const MenuAction: React.FC = ({ children }) => {
  const { toggle } = useContext(Context)

  return <button onClick={toggle}>{children}</button>
}

const SubMenu: React.FC<{
  items: {
    text: string
    onClick?: () => void
    errorStyle?: boolean
    headerStyle?: boolean
    src?: string
  }[]
}> = ({ items }) => {
  const { isOpen } = useContext(Context)

  const header = items.filter((e) => e.headerStyle)
  const regular = items.filter((e) => !e.errorStyle && !e.headerStyle)
  const errors = items.filter((e) => e.errorStyle)

  return (
    <AnimatePresence>
      {isOpen && (
        <Wrapper
          initial={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -30 }}
        >
          {header.map((item) => {
            return (
              <Text size="small" color="g10" key={item.text}>
                <Button onClick={item.onClick}>{item.text}</Button>
              </Text>
            )
          })}

          <Separator />

          {regular.map((item) => {
            const Comp = item.src
              ? (props: any) => (
                  <ButtonLink target="_blank" href={item.src} {...props} />
                )
              : Button
            return (
              <Text key={item.text}>
                <Comp onClick={item.onClick}>{item.text}</Comp>
              </Text>
            )
          })}

          <Separator />

          {errors.map((item) => {
            return (
              <Text color="error" key={item.text}>
                <Button onClick={item.onClick}>{item.text}</Button>
              </Text>
            )
          })}
        </Wrapper>
      )}
    </AnimatePresence>
  )
}

export { Menu, MenuAction, SubMenu }
