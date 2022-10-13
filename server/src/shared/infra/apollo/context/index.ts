import { ExpressContext } from 'apollo-server-express'

import { getAuthentedUser } from './getAuthentedUser'

export interface IAppContext extends ExpressContext {
  authentication: {
    user_id: string | undefined
  }
}

export const context = async (ctx: ExpressContext): Promise<IAppContext> => {
  return {
    ...ctx,
    authentication: {
      user_id: await getAuthentedUser(ctx as IAppContext),
    },
  }
}
