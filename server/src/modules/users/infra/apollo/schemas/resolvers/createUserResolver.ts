import { container } from 'tsyringe'

import { CreateUserService } from '@modules/users/services/CreateUserService'

interface ICreateUserInput {
  data: {
    name: string
    username: string
    password: string
  }
}

export const createUser = async (_: any, {
  data: { name, username, password }
}: ICreateUserInput) => {
  const createUserService = container.resolve(CreateUserService)

  const createdUser = await createUserService.execute({ name, username, password })

  return createdUser
}
