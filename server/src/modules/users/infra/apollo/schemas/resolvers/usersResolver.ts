import { container } from 'tsyringe'

import { ListUsersService } from '@modules/users/services/ListUsersService'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
  }
}

export const users = async (_: any, {
  data: { page, perPage }
}: IApiFiltersInput) => {
  const listUsersService = container.resolve(ListUsersService)

  const usersList = await listUsersService.execute({
    page, perPage
  })

  return usersList
}
