import { ExpressContext } from 'apollo-server-express'

import { getAuthentedUser } from './getAuthentedUser'

export const context = async (ctx: ExpressContext) => {
  return {
    ...ctx,
    authentication: {
      user_id: await getAuthentedUser(ctx),
    },
  }
}
