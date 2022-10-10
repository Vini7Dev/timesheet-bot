import 'reflect-metadata'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { CreateUserService } from './CreateUserService'
import { UpdateProfileService } from './UpdateProfileService'
import { AppError } from '@shared/errors/AppError'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let updateProfileService: UpdateProfileService
let createUserService: CreateUserService

describe('UpdateProfileService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    updateProfileService = new UpdateProfileService(
      usersRepository,
      encryptProvider,
    )
    createUserService = new CreateUserService(
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to update profile', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const updatedUser = await updateProfileService.execute({
      authenticatedUserId: createdUser.id,
      userId: createdUser.id,
      name: 'New name',
      email: 'newemail@mail.com',
      username: 'new.username',
      newPassword: 'newpassword',
      currentPassword: 'jhon123',
    })

    expect(updatedUser).toHaveProperty('id')
    expect(updatedUser.id).toEqual(createdUser.id)
    expect(updatedUser.name).toEqual('New name')
    expect(updatedUser.email).toEqual('newemail@mail.com')
    expect(updatedUser.username).toEqual('new.username')
    expect(updatedUser.password).toEqual('newpassword')
    expect(updatedUser.updated_at).not.toEqual(updatedUser.created_at)
  })

  it('should be able to proccess request without changes', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const updatedUser = await updateProfileService.execute({
      authenticatedUserId: createdUser.id,
      userId: createdUser.id,
      currentPassword: 'jhon123',
    })

    expect(updatedUser).toHaveProperty('id')
    expect(updatedUser.id).toEqual(createdUser.id)
    expect(updatedUser.name).toEqual(createdUser.name)
    expect(updatedUser.email).toEqual(createdUser.email)
    expect(updatedUser.username).toEqual(createdUser.username)
    expect(updatedUser.password).toEqual(createdUser.password)
    expect(updatedUser.updated_at).not.toEqual(updatedUser.created_at)
  })

  it('should not be able to update profile with invalid current password', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      updateProfileService.execute({
        authenticatedUserId: createdUser.id,
        userId: createdUser.id,
        name: 'New name',
        email: 'newemail@mail.com',
        username: 'new.username',
        newPassword: 'newpassword',
        currentPassword: 'invalid-password',
      })
    ).rejects.toEqual(new AppError('Invalid current password!', 403))
  })

  it("should not be able to update another user's profile", async () => {
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
      updateProfileService.execute({
        authenticatedUserId: secondUser.id,
        userId: firstUser.id,
        name: 'New name',
        email: 'newemail@mail.com',
        username: 'new.username',
        newPassword: 'newpassword',
        currentPassword: 'invalid-password',
      })
    ).rejects.toEqual(
      new AppError('You do not have permission to update this profile!', 403)
    )
  })

  it('should not be able to update an non-existent profile', async () => {
    await expect(
      updateProfileService.execute({
        authenticatedUserId: 'non-existent-profile',
        userId: 'non-existent-profile',
        name: 'New name',
        email: 'newemail@mail.com',
        username: 'new.username',
        newPassword: 'newpassword',
        currentPassword: 'invalid-password',
      })
    ).rejects.toEqual(new AppError('Profile not found!', 404))
  })
})
