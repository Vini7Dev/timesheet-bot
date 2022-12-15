import 'reflect-metadata'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { ShowProfileService } from './ShowProfileService'
import { AppError } from '@shared/errors/AppError'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let showProfileService: ShowProfileService

describe('ShowProfileService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    showProfileService = new ShowProfileService(
      usersRepository,
    )
  })

  it('should be able to show profile data', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const profileData = await showProfileService.execute({
      user_id: createdUser.id,
      authenticatedUserId: createdUser.id,
    })

    expect(profileData).toHaveProperty('id')
    expect(profileData?.id).toEqual(createdUser.id)
  })

  it('should not be able to get a non-existent profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      showProfileService.execute({
        user_id: 'non-existent-user',
        authenticatedUserId: createdUser.id,
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it("should not be able to get another user's profile", async () => {
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
      showProfileService.execute({
        user_id: firstUser.id,
        authenticatedUserId: secondUser.id,
      })
    ).rejects.toEqual(
      new AppError('You do not have permission to view this profile!', 403)
    )
  })
})
