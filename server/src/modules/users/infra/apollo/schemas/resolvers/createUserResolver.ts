import { CreateUserService } from "@modules/users/services/CreateUserService"

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
  const createUserService = new CreateUserService()

  const createdUser = await createUserService.execute({ name, username, password })

  return createdUser
}
