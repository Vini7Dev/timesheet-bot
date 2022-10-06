import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'

import { resolvers, typeDefs } from './schemas'

import '@shared/containers'

const PORT = 4003

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

server.listen(PORT).then(({ url }) => {
  console.log(`===> Server running on ${url}`)
})
