import 'reflect-metadata'
import jwt from 'jsonwebtoken'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { CreateAuthenticationService } from './CreateAuthenticationService'
import { CreateUserService } from './CreateUserService'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let createAuthenticationService: CreateAuthenticationService
let createUserService: CreateUserService

describe('CreateAuthenticationService', () => {
  beforeAll(() => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => {
      return 'token_mock'
    })
  })

  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    createAuthenticationService = new CreateAuthenticationService(
      usersRepository,
      encryptProvider,
    )
    createUserService = new CreateUserService(
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to make login with email', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const authResponse = await createAuthenticationService.execute({
      emailOrUsername: 'jhondoe@mail.com',
      password: 'jhon123'
    })

    expect(authResponse).toHaveProperty('token')
    expect(authResponse.user_id).toEqual(createdUser.id)
  })

  it('should be able to make login with username', async () => {
    const createdUser = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const authResponse = await createAuthenticationService.execute({
      emailOrUsername: 'jhon.doe',
      password: 'jhon123'
    })

    expect(authResponse).toHaveProperty('token')
    expect(authResponse.user_id).toEqual(createdUser.id)
  })

  it('should not be able to make login with non-existent user', async () => {
    await expect(
      createAuthenticationService.execute({
        emailOrUsername: 'non-existent-user',
        password: 'jhon123'
      })
    ).rejects
  })

  it('should not be able to make login with invalid password', async () => {
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      createAuthenticationService.execute({
        emailOrUsername: 'jhon.doe',
        password: 'invalid-password'
      })
    ).rejects
  })
})
