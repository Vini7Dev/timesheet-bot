import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Router } from './routes'

import GlobalStyles from './styles/global'

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={Router} />

      <GlobalStyles />
    </>
  )
}

export default App
