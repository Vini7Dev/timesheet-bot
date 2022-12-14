import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  authenticatedUserId: string
  user_id: string
  name?: string
  email?: string
  username?: string
  newPassword?: string
  currentPassword: string
}

@injectable()
export class UpdateProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptProvider')
    private encryptProvider: IEncrypt,
  ) {}

  public async execute({
    authenticatedUserId,
    user_id,
    name,
    email,
    username,
    newPassword,
    currentPassword,
  }: IServiceProps): Promise<User> {
    const profileToUpdate = await this.usersRepository.findById(user_id)
    if (!profileToUpdate) {
      throw new AppError('Profile not found!', 404)
    }

    if (profileToUpdate.id !== authenticatedUserId) {
      throw new AppError('You do not have permission to update this profile!', 403)
    }

    const usernameAlreadyExists = await this.usersRepository.findByUsernameOrEmail({
      email, username,
    })
    if (usernameAlreadyExists && usernameAlreadyExists.id !== profileToUpdate.id) {
      throw new AppError('This username or email already exists!')
    }

    const passwordDecrypted = this.encryptProvider.decrypt(profileToUpdate.password)
    if (currentPassword !== passwordDecrypted) {
      throw new AppError('Invalid current password!', 403)
    }

    const dataToUpdateProfile = {
      id: user_id,
      name: name ?? profileToUpdate.name,
      email: email ?? profileToUpdate.email,
      username: username ?? profileToUpdate.username,
    }

    if (newPassword) {
      Object.assign(dataToUpdateProfile, {
        password: this.encryptProvider.encrypt(newPassword)
      })
    }

    const updatedProfile = await this.usersRepository.update(dataToUpdateProfile)

    return updatedProfile
  }
}
