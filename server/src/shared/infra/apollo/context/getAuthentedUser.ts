import { verify } from 'jsonwebtoken'

import { cookieParser } from '@utils/cookieParser'
import { authConfig } from '@configs/auth'
import { AppError } from '@shared/errors/AppError'
import { IAppContext, IWSAppContext } from '.'

interface IVerifyPayload {
  sub: string
}

export const getAuthentedUser = async (
  ctx: IAppContext | IWSAppContext
): Promise<string | undefined> => {
  let cookies = ''

  const genericContext = ctx as any
  if(genericContext.req) {
    cookies = genericContext?.req?.headers?.cookie ?? ''
  } else {
    cookies = genericContext?.upgradeReq?.rawHeaders?.join(';') ?? ''
  }

  const { multifyToken } = cookieParser(cookies)

  if (!multifyToken) {
    return undefined
  }

  try {
    const { secret } = authConfig.jwt

    const { sub: user_id } = verify(multifyToken, secret) as IVerifyPayload

    return user_id
  } catch(err) {
    throw new AppError('Invalid authentication token!', 401)
  }
}
