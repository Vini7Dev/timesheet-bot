import { ExpressContext } from 'apollo-server-express'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { redisConfig } from '@configs/redis'
import { getAuthentedUser } from './getAuthentedUser'

export interface IAppContext extends ExpressContext {
  pubsub: RedisPubSub
  authentication: {
    user_id: string | undefined
  }
}

export interface IWSAppContext {
  pubsub: RedisPubSub
  authentication: {
    user_id: string | undefined
  }
}

export const pubsub = new RedisPubSub({ connection: redisConfig })

export const context = async (
  ctx: IAppContext | IWSAppContext
): Promise<IAppContext | IWSAppContext> => {
  return {
    ...ctx,
    pubsub,
    authentication: {
      user_id: await getAuthentedUser(ctx),
    },
  }
}
