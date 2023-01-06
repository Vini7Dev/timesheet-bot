import React from 'react'
import { WebSocketLink } from '@apollo/client/link/ws'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import { SERVER_URI, WEB_SOCKET_URI } from '../utils/constants'

const httpLink = new HttpLink({
  uri: SERVER_URI,
  credentials: 'include'
})

const websocketLink = new WebSocketLink(new SubscriptionClient(WEB_SOCKET_URI))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  websocketLink,
  httpLink
)

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})

const ApolloClientProvider: React.FC<any> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

export default ApolloClientProvider
