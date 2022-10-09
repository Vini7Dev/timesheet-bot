import { container } from 'tsyringe'
import { ExpressContext } from 'apollo-server-express'

import { CreateAuthenticationService } from '@modules/users/services/CreateAuthenticationService'

interface ILoginUserInput {
  data: {
    emailOrUsername: string
    password: string
  }
}

export const loginUser = async (
  _: any, {
    data: { emailOrUsername, password }
  }: ILoginUserInput,
  ctx: ExpressContext) => {
  const createAuthenticationService = container.resolve(CreateAuthenticationService)

  const authenticationData = await createAuthenticationService.execute({
    emailOrUsername, password
  })

  ctx.res.cookie('multifyToken', authenticationData.token, {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'none',
  })

  return authenticationData
}
