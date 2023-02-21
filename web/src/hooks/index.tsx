import React from 'react'
import ApolloClientProvider from './apollo'

import { AuthProvider } from './auth'
import { NavigationProvider } from './navigation'
import { RuntimeProvider } from './runtime'
import { TimerProvider } from './timer'
import { ToastProvider } from './toast'

export const AppProvider: React.FC<any> = ({ children }) => {
  return (
    <RuntimeProvider>
      <ApolloClientProvider>
        <ToastProvider>
          <AuthProvider>
            <TimerProvider>
              <NavigationProvider>
                {children}
              </NavigationProvider>
            </TimerProvider>
          </AuthProvider>
        </ToastProvider>
      </ApolloClientProvider>
    </RuntimeProvider>
  )
}
