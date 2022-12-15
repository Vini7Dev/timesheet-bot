import React from 'react'
import ApolloClientProvider from './apollo'

import { AuthProvider } from './auth'
import { TimerProvider } from './timer'
import { ToastProvider } from './toast'

export const AppProvider: React.FC<any> = ({ children }) => {
  return (
    <ApolloClientProvider>
      <ToastProvider>
        <AuthProvider>
          <TimerProvider>
            {children}
          </TimerProvider>
        </AuthProvider>
      </ToastProvider>
    </ApolloClientProvider>
  )
}
