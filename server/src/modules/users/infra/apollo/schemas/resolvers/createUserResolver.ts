import { CreateUserService } from "@modules/users/services/CreateUserService"

interface ICreateUserInput {
  data: {
    name: string
    email: string
    password: string
  }
}

export const createUser = async (_: any, {
  data: { name, email, password }
}: ICreateUserInput) => {
  const createUserService = new CreateUserService()

  const createdUser = await createUserService.execute({ name, email, password })

  return createdUser
}
