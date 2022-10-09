import { verify } from 'jsonwebtoken'

import { cookieParser } from '@utils/cookieParser'
import { authConfig } from '@configs/auth'
import { IAppContext } from '.'

interface IVerifyPayload {
  sub: string
}

export const getAuthentedUser = async (ctx: IAppContext) => {
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