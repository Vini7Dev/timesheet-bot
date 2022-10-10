import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { UpdateProfileService } from '@modules/users/services/UpdateProfileService'

interface IUpdateUserInput {
  data: {
    userId: string
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
      userId,
      name,
      email,
      username,
      newPassword,
      currentPassword,
    }
  }: IUpdateUserInput,
  ctx: IAppContext
) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const updateProfileService = container.resolve(UpdateProfileService)

  const updatedUser = await updateProfileService.execute({
    authenticatedUserId: authenticatedUserId ?? '',
    userId,
    name,
    email,
    username,
    newPassword,
    currentPassword,
  })

  return updatedUser
}
