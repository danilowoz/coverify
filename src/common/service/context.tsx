import React, { createContext, useState } from 'react'

import { Analytics } from './analytics'
import { ScreenShot } from './screenshot'
import { Spotify } from './spotify'
import { UnSplash } from './unsplash'

/**
 * Dependencies
 */
const dependencies = {
  analytics: Analytics,
  spotify: Spotify,
  unsplash: UnSplash,
  screenshot: ScreenShot,
}

/**
 * Types
 */
type InstanceOfDependencies = {
  analytics: Analytics
  spotify: Spotify
  unsplash: UnSplash
  screenshot: ScreenShot
}

type DependenciesProps = typeof dependencies
type DependenciesKeys = keyof DependenciesProps

type DependenciesParameters = {
  [K in DependenciesKeys]: Unpacked<ConstructorParameters<DependenciesProps[K]>>
}

type InstanceDependencies = {
  [K in DependenciesKeys]: InstanceType<DependenciesProps[K]>
}

type State = {
  [K in keyof InstanceDependencies]?: InstanceDependencies[K]
}

type ReturnOfContext<R extends DependenciesKeys> =
  | InstanceOfDependencies[R]
  | false

/**
 * Methods
 */
interface ContextMethods {
  create: <S extends DependenciesKeys>(
    service: S,
    options?: DependenciesParameters[S]
  ) => ReturnOfContext<S>
  get: <S extends DependenciesKeys>(service: S) => ReturnOfContext<S>
  destroy: (service: DependenciesKeys) => boolean
  dependencies: State
}

const DependenciesContext = createContext<ContextMethods>({
  create: () => false,
  destroy: () => false,
  get: () => false,
  dependencies: {},
})

/**
 * Provider of dependencies service
 */
const DependenciesProvider: React.FC = ({ children }) => {
  const [initialized, setInitialized] = useState<State>({})

  /**
   * Create a new service and return the instance
   */
  const create: ContextMethods['create'] = <S extends DependenciesKeys>(
    name: S,
    options?: DependenciesParameters[S]
  ) => {
    const Dependency = dependencies[name]

    // It doesn't exist
    if (!Dependency) {
      return false
    }

    // It already exist
    if (initialized[name]) {
      return initialized[name] as InstanceDependencies[S]
    }

    // Init
    // I wasn't able to pass the right options typed-safe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instanceOfDependency = new Dependency(options as any)

    // Update
    setInitialized((prev) => ({
      ...prev,
      [name]: instanceOfDependency,
    }))

    // Return
    return instanceOfDependency as InstanceDependencies[S]
  }

  /**
   * Destroy a service
   */
  const destroy: ContextMethods['destroy'] = (name) => {
    // It doesn't exist
    if (!initialized[name]) {
      return false
    }

    // Update
    setInitialized((prev) => {
      const newObj = prev
      delete newObj[name]

      return newObj
    })

    // return
    return true
  }

  /**
   * Get a the instance of dependency
   */
  const get: ContextMethods['get'] = <S extends DependenciesKeys>(
    service: S
  ) => {
    if (initialized[service]) {
      return initialized[service] as InstanceOfDependencies[S]
    }

    return false
  }

  /**
   * Context
   */
  return (
    <DependenciesContext.Provider
      value={{ create, destroy, get, dependencies: initialized }}
    >
      {children}
    </DependenciesContext.Provider>
  )
}

export { DependenciesContext, DependenciesProvider }
