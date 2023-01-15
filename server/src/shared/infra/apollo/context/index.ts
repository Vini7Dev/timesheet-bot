import { ExpressContext } from 'apollo-server-express'

import { IPubSub } from '../models/IPubSub'
import { ApolloRedisPubSub } from './ApolloRedisPubSub'
import { getAuthentedUser } from './getAuthentedUser'

export interface IAppContext extends ExpressContext {
  pubSub: IPubSub
  authentication: {
    user_id: string | undefined
  }
}

export interface IWSAppContext {
  pubSub: IPubSub
  authentication: {
    user_id: string | undefined
  }
}

export const context = async (
  ctx: IAppContext | IWSAppContext
): Promise<IAppContext | IWSAppContext> => {
  return {
    ...ctx,
    pubSub: new ApolloRedisPubSub(),
    authentication: {
      user_id: await getAuthentedUser(ctx),
    },
  }
}
