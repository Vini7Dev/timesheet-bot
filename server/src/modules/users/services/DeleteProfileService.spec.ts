import 'reflect-metadata'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { DeleteProfileService } from './DeleteProfileService'
import { AppError } from '@shared/errors/AppError'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let deleteProfileService: DeleteProfileService

describe('DeleteProfileService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    deleteProfileService = new DeleteProfileService(
      usersRepository,
    )
  })

  it('should be able to delete profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const deletedProfileId = await deleteProfileService.execute({
      userId: createdUser.id,
      authenticatedUserId: createdUser.id,
    })

    expect(deletedProfileId).toEqual(createdUser.id)
  })

  it('should not be able to delete different user profile', async () => {
    const firstUser = await usersRepository.create({
      name: 'Jhon Doe - 1',
      email: 'jhondoe1@mail.com',
      username: 'jhon.doe1',
      password: 'jhon123',
    })

    const secondUser = await usersRepository.create({
      name: 'Jhon Doe - 2',
      email: 'jhondoe2@mail.com',
      username: 'jhon.doe2',
      password: 'jhon123',
    })

    await expect(
      deleteProfileService.execute({
        userId: firstUser.id,
        authenticatedUserId: secondUser.id,
      })
    ).rejects.toEqual(
      new AppError('You do not have permission to delete this profile!', 403)
    )
  })
})
