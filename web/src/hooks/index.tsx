import React from 'react'

import { AuthProvider } from './auth'
import { TimerProvider } from './timer'
import { ToastProvider } from './toast'

export const AppProvider: React.FC<any> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <TimerProvider>
          {children}
        </TimerProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
