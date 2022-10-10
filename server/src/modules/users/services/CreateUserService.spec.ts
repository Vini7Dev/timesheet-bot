import 'reflect-metadata'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { CreateUserService } from './CreateUserService'
import { AppError } from '@shared/errors/AppError'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let createUserService: CreateUserService

describe('CreateUserService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    createUserService = new CreateUserService(
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    expect(createdUser).toHaveProperty('id')
    expect(createdUser).toHaveProperty('created_at')
    expect(createdUser).toHaveProperty('updated_at')
  })

  it('should not be able to create a user with an already existing email', async () => {
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'sameEmail',
      username: 'jhon.doe1',
      password: 'jhon123',
    })

    await expect(createUserService.execute({
      name: 'Jhon Doe',
      email: 'sameEmail',
      username: 'jhon.doe2',
      password: 'jhon123',
    })).rejects.toEqual(new AppError('This username or email already exists!'))
  })

  it('should not be able to create a user with an already existing username', async () => {
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe1@mail.com',
      username: 'sameUsername',
      password: 'jhon123',
    })

    await expect(createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe2@mail.com',
      username: 'sameUsername',
      password: 'jhon123',
    })).rejects.toEqual(new AppError('This username or email already exists!'))
  })
})
