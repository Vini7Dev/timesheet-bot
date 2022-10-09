import { container } from 'tsyringe'

import { ShowProfileService } from '@modules/users/services/ShowProfileService'
import { IAppContext } from '@shared/infra/apollo/context'

interface IUserInput {
  id: string
}

export const user = async (_: any, { id }: IUserInput, ctx: IAppContext) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const showProfileService = container.resolve(ShowProfileService)

  const findedUser = await showProfileService.execute({
    userId: id,
    authenticatedUserId: authenticatedUserId ?? '',
  })

  return findedUser
}
