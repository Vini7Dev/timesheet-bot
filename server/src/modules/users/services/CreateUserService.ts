import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'

interface IServiceProps {
  name: string
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

  public async execute({ name, username, password }: IServiceProps): Promise<User> {
    const usernameAlreadyExists = await this.usersRepository.findByUsername(username)

    if (usernameAlreadyExists) {
      throw new Error('This username already exists!')
    }

    const cryptPassword = await this.encryptProvider.encrypt(password)

    const createdUser = await this.usersRepository.create({
      name,
      username,
      password: cryptPassword,
    })

    return createdUser
  }
}
