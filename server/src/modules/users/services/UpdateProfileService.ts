import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  authenticatedUserId: string
  userId: string
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
    userId,
    name,
    email,
    username,
    newPassword,
    currentPassword,
  }: IServiceProps): Promise<User> {
    if (userId !== authenticatedUserId) {
      throw new Error('You do not have permission to update this profile!')
    }

    const profileToUpdate = await this.usersRepository.findById(userId)
    if (!profileToUpdate) {
      throw new Error('Profile not found!')
    }

    const passwordDecrypted = this.encryptProvider.decrypt(profileToUpdate.password)
    if (currentPassword !== passwordDecrypted) {
      throw new Error('Invalid current password!')
    }

    const dataToUpdateProfile = {
      id: userId,
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
