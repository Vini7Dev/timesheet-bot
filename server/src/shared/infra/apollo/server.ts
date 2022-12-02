import 'reflect-metadata'

import express from 'express'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { InMemoryLRUCache } from 'apollo-server-caching'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { execute, subscribe } from 'graphql'

import { context, IWSAppContext } from './context'
import { resolvers, typeDefs } from './schemas'

import '@shared/containers'

(async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  const httpServer = createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    context,
    schema,
    cache: new InMemoryLRUCache(),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
      }
    ],
  })

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    async onConnect(
      _: any,
      ws: IWSAppContext,
    ) {
      const contextData = await context(ws)

      return {
        ...contextData,
      }
    },
  }, {
    server: httpServer,
    path: server.graphqlPath,
  })

  await server.start()

  server.applyMiddleware({ app, cors: {
    origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
    credentials: true,
  } })

  const SERVER_PORT = process.env.SERVER_PORT ?? 4003;

  await new Promise(
    (resolve: any) => httpServer.listen({ port: SERVER_PORT }, resolve)
  )

  console.log(`===> Server running on http://localhost:${SERVER_PORT}${server.graphqlPath}`)
})(typeDefs, resolvers)
