import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const SERVER_URI = 'http://localhost:4003/graphql'

export const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache(),
  credentials: 'include'
})

const ApolloClientProvider: React.FC<any> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

export default ApolloClientProvider
