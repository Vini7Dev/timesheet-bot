import { inject, injectable } from 'tsyringe'
import { sign } from 'jsonwebtoken'

import { IUsersRepository } from '../repositories/IUsersRepository'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { authConfig } from '@configs/auth'

interface IServiceProps {
  emailOrUsername: string
  password: string
}

interface ISerciceResponse {
  token: string
  user_id: string
}

@injectable()
export class CreateAuthenticationService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptProvider')
    private encryptProvider: IEncrypt,
  ) {}

  public async execute({
    emailOrUsername,
    password,
  }: IServiceProps): Promise<ISerciceResponse> {
    const userToLogin = await this.usersRepository.findByUsernameOrEmail({
      email: emailOrUsername,
      username: emailOrUsername,
    })

    if (!userToLogin) {
      throw new Error('Invalid credentials!')
    }

    const passwordDecrypted = this.encryptProvider.decrypt(userToLogin.password)

    if (password !== passwordDecrypted) {
      throw new Error('Invalid credentials!')
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: userToLogin.id,
      expiresIn,
    })

    return {
      token,
      user_id: userToLogin.id,
    }
  }
}
