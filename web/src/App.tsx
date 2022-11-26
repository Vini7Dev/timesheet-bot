import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { MainRoutes } from './routes'

import GlobalStyles from './styles/global'

const App: React.FC = () => {
  return (
    <Router>
      <MainRoutes />

      <GlobalStyles />
    </Router>
  )
}

export default App
