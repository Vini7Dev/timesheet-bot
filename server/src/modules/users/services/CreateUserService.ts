import { User } from '../infra/prisma/entities/User'
import { UsersRepository } from '../infra/prisma/repositories/UsersRepository'

interface IServiceProps {
  name: string
  username: string
  password: string
}

export class CreateUserService {
  private usersRepository = new UsersRepository()

  public async execute({ name, username, password }: IServiceProps): Promise<User> {
    const createdUser = await this.usersRepository.create({ name, username, password })

    return createdUser
  }
}
