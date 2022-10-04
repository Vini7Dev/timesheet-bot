import { ApolloServer } from 'apollo-server'

import { resolvers, typeDefs } from './schemas'

const PORT = 4003

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

server.listen(PORT).then(({ url }) => {
  console.log(`===> Server running on ${url}`)
})
