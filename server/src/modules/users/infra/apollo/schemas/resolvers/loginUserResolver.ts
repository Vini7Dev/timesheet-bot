import { container } from 'tsyringe'

import { CreateAuthenticationService } from '@modules/users/services/CreateAuthenticationService'
import { IAppContext } from '@shared/infra/apollo/context'

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
  ctx: IAppContext) => {
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
