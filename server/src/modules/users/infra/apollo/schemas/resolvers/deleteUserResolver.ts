import { container } from 'tsyringe'

import { DeleteProfileService } from '@modules/users/services/DeleteProfileService'
import { IAppContext } from '@shared/infra/apollo/context'

interface IDeleteUserInput {
  id: string
}

export const deleteUser = async (_: any, { id }: IDeleteUserInput, ctx: IAppContext) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const deleteProfileService = container.resolve(DeleteProfileService)

  const userIdDeleted = await deleteProfileService.execute({
    userId: id,
    authenticatedUserId: authenticatedUserId ?? '',
  })

  return userIdDeleted
}
