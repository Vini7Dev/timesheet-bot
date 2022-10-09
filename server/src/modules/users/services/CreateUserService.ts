import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'

interface IServiceProps {
  name: string
  email: string
  username: string
  password: string
}

@injectable()
export class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptProvider')
    private encryptProvider: IEncrypt,
  ) {}

  public async execute({ name, email, username, password }: IServiceProps): Promise<User> {
    const usernameAlreadyExists = await this.usersRepository.findByUsernameOrEmail({
      email, username,
    })

    if (usernameAlreadyExists) {
      throw new Error('This username or email already exists!')
    }

    const cryptPassword = this.encryptProvider.encrypt(password)

    const createdUser = await this.usersRepository.create({
      name,
      email,
      username,
      password: cryptPassword,
    })

    return createdUser
  }
}
