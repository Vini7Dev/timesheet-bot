import { container } from 'tsyringe'

import { DeleteProfileService } from '@modules/users/services/DeleteProfileService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IDeleteUserInput {
  id: string
}

export const deleteUser = async (_: any, { id }: IDeleteUserInput, ctx: IAppContext) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const deleteProfileService = container.resolve(DeleteProfileService)

  const userIdDeleted = await deleteProfileService.execute({
    user_id: id,
    authenticatedUserId,
  })

  return userIdDeleted
}
