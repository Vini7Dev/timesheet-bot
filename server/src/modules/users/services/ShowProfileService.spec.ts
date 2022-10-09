import 'reflect-metadata'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { CreateUserService } from './CreateUserService'
import { ShowProfileService } from './ShowProfileService'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let showProfileService: ShowProfileService
let createUserService: CreateUserService

describe('ShowProfileService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    showProfileService = new ShowProfileService(
      usersRepository,
    )
    createUserService = new CreateUserService(
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to show profile data', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const profileData = await showProfileService.execute({
      userId: createdUser.id,
      authenticatedUserId: createdUser.id,
    })

    expect(profileData).toHaveProperty('id')
    expect(profileData?.id).toEqual(createdUser.id)
  })

  it('should not be able to get a non-existent profile', async () => {
    await expect(
      showProfileService.execute({
        userId: 'non-existent-user',
        authenticatedUserId: 'non-existent-user'
      })
    ).rejects
  })

  it("should not be able to get another user's profile", async () => {
    const firstUser = await createUserService.execute({
      name: 'Jhon Doe - 1',
      email: 'jhondoe1@mail.com',
      username: 'jhon.doe1',
      password: 'jhon123',
    })

    const secondUser = await createUserService.execute({
      name: 'Jhon Doe - 2',
      email: 'jhondoe2@mail.com',
      username: 'jhon.doe2',
      password: 'jhon123',
    })

    await expect(
      showProfileService.execute({
        userId: firstUser.id,
        authenticatedUserId: secondUser.id,
      })
    ).rejects
  })
})