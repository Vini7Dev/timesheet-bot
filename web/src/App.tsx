import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from './hooks'
import { MainRoutes } from './routes'

import GlobalStyles from './styles/global'

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <MainRoutes />
      </AppProvider>

      <GlobalStyles />
    </Router>
  )
}

export default App
