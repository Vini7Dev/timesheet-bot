import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'

import { context } from './context'
import { resolvers, typeDefs } from './schemas'

import '@shared/containers'

const SERVER_PORT = process.env.SERVER_PORT ?? 4003

const server = new ApolloServer({
  context,
  resolvers,
  typeDefs,
})

server.listen(SERVER_PORT).then(({ url }) => {
  console.log(`===> Server running on ${url}`)
})
