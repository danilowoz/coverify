import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'

/**
 * Main entry component of application
 * The purpose here is to handle all kinds of effects
 */
import { DependenciesContext } from 'common/service/context'
import { selectors as userSelector } from 'modules/User/config/reducer'

const Core: React.FC = ({ children }) => {
  const dependencies = useContext(DependenciesContext)
  const token = useSelector(userSelector.getToken)

  /**
   * Init services
   */
  useEffect(() => {
    dependencies.create('unsplash')

    const trackingCode = process.env.ANALYTICS || ''
    const analyticsService = dependencies.create('analytics', { trackingCode })

    if (analyticsService) {
      analyticsService.init()
      analyticsService.logPageView()
    }
  }, [dependencies])

  /**
   * Rehydrate services
   */
  useEffect(() => {
    if (token) {
      dependencies.create('spotify')
    }
  }, [token, dependencies])

  return <>{children}</>
}

export { Core }
