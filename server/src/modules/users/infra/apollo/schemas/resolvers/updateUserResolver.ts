import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { UpdateProfileService } from '@modules/users/services/UpdateProfileService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IUpdateUserInput {
  data: {
    user_id: string
    name?: string
    email?: string
    username?: string
    newPassword?: string
    currentPassword: string
  }
}

export const updateUser = async (
  _: any,
  {
    data: {
      user_id,
      name,
      email,
      username,
      newPassword,
      currentPassword,
    }
  }: IUpdateUserInput,
  ctx: IAppContext
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const updateProfileService = container.resolve(UpdateProfileService)

  const updatedUser = await updateProfileService.execute({
    authenticatedUserId,
    user_id,
    name,
    email,
    username,
    newPassword,
    currentPassword,
  })

  return updatedUser
}
