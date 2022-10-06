import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  name: string
  username: string
  password: string
}

@injectable()
export class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ name, username, password }: IServiceProps): Promise<User> {
    const createdUser = await this.usersRepository.create({ name, username, password })

    return createdUser
  }
}
