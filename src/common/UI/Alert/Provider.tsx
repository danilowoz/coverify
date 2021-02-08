import { AnimatePresence } from 'framer-motion'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { AlertMessage } from './Message'
import { AlertStrut, ContextProp } from './types'

const AlertContext = createContext<ContextProp>({
  dispatchAlert: () => null as any,
})

const ALERT_TIMER = 5e3

const AlertProvider: React.FC = ({ children }) => {
  const [alertData, setAlertData] = useState<AlertStrut | undefined>()

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertData(undefined)
    }, ALERT_TIMER)

    return () => {
      clearTimeout(timer)
    }
  }, [alertData])

  return (
    <AlertContext.Provider value={{ dispatchAlert: setAlertData }}>
      <AnimatePresence>
        {alertData && (
          <AlertMessage
            message={alertData.message}
            type={alertData.type}
            handleRetry={alertData.handleRetry}
          />
        )}
      </AnimatePresence>
      {children}
    </AlertContext.Provider>
  )
}

const useAlert = () => {
  const { dispatchAlert } = useContext(AlertContext)

  return dispatchAlert
}

export { useAlert, AlertProvider }
