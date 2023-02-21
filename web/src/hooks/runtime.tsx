import React, { createContext, useContext, useEffect, useState } from 'react'

interface IRuntimeContext {
  isMobile: boolean
}

const RuntimeContext = createContext<IRuntimeContext>({} as unknown as IRuntimeContext)

export const RuntimeProvider: React.FC<any> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleWindowResize = (): void => {
      if (window.innerWidth > 969) {
        setIsMobile(false)
      } else {
        setIsMobile(true)
      }
    }

    handleWindowResize()

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <RuntimeContext.Provider value={{
      isMobile
    }}>
      {children}
    </RuntimeContext.Provider>
  )
}

export const useRuntime = (): IRuntimeContext => {
  const context = useContext(RuntimeContext)

  if (!context) {
    throw new Error('useRuntime must be used within a RuntimeProvider.')
  }

  return context
}
