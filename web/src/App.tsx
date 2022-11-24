import React from 'react'

import GlobalStyles from './styles/global'
import { SignIn } from './pages/SignIn'

const App: React.FC = () => {
  return (
    <div className="App">
      <SignIn />

      <GlobalStyles />
    </div>
  )
}

export default App
