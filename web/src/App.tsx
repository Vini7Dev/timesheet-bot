import React from 'react'

import GlobalStyles from './styles/global'
// import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'

const App: React.FC = () => {
  return (
    <div className="App">
      <SignUp />

      <GlobalStyles />
    </div>
  )
}

export default App
