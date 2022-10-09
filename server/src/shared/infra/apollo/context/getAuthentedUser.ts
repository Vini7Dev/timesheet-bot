import { ExpressContext } from 'apollo-server-express'
import { verify } from 'jsonwebtoken'

import { cookieParser } from '@utils/cookieParser'
import { authConfig } from '@configs/auth'

interface IVerifyPayload {
  sub: string
}

export const getAuthentedUser = async (ctx: ExpressContext) => {
  const { cookie: headerCookies } = ctx.req.headers

  const { multifyToken } = cookieParser(headerCookies)

  if (!multifyToken) {
    return undefined
  }

  try {
    const { secret } = authConfig.jwt

    const { sub: user_id } = verify(multifyToken, secret) as IVerifyPayload

    return user_id
  } catch(err) {
    throw new Error('Invalid authentication token!')
  }
}
