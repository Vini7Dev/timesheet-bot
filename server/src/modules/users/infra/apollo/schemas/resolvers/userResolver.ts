import { container } from 'tsyringe'

import { ShowProfileService } from '@modules/users/services/ShowProfileService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IUserInput {
  id: string
}

export const user = async (_: any, { id }: IUserInput, ctx: IAppContext) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const showProfileService = container.resolve(ShowProfileService)

  const findedUser = await showProfileService.execute({
    user_id: id,
    authenticatedUserId,
  })

  return findedUser
}
