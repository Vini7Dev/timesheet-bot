import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from './hooks'
import { MainRoutes } from './routes'

import GlobalStyles from './styles/global'

const SERVER_URI = 'http://localhost:4003/graphql'

export const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache()
})

const App: React.FC = () => {
  return (
    <Router>
      <ApolloProvider client={client}>
        <AppProvider>
          <MainRoutes />
        </AppProvider>
      </ApolloProvider>

      <GlobalStyles />
    </Router>
  )
}

export default App
