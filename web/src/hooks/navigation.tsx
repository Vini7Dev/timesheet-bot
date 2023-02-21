import React, { createContext, useCallback, useContext, useState } from 'react'

interface INavigationContext {
  mobileNavigationIsOpen: boolean
  toggleMobileNavigationIsOpen: () => void
}

const NavigationContext = createContext<INavigationContext>({} as unknown as INavigationContext)

export const NavigationProvider: React.FC<any> = ({ children }) => {
  const [mobileNavigationIsOpen, setMobileNavigationIsOpen] = useState(false)

  const toggleMobileNavigationIsOpen = useCallback(() => {
    setMobileNavigationIsOpen(!mobileNavigationIsOpen)
  }, [mobileNavigationIsOpen])

  return (
    <NavigationContext.Provider value={{
      mobileNavigationIsOpen,
      toggleMobileNavigationIsOpen
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = (): INavigationContext => {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider.')
  }

  return context
}
