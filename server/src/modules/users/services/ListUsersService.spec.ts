import 'reflect-metadata'

import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { CreateUserService } from './CreateUserService'
import { ListUsersService } from './ListUsersService'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let listUsersService: ListUsersService
let createUserService: CreateUserService

describe('ListUsersService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    listUsersService = new ListUsersService(
      usersRepository,
    )
    createUserService = new CreateUserService(
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to list users', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const usersList = await listUsersService.execute({})

    expect(usersList).toHaveLength(1)
    expect(usersList[0].id).toEqual(createdUser.id)
  })

  it('should be able to list users with pagination filters', async () => {
    await usersRepository.create({
      name: 'Jhon Doe - 1',
      email: 'jhondoe1@mail.com',
      username: 'jhon.doe1',
      password: 'jhon123'
    })

    const secondUser = await usersRepository.create({
      name: 'Jhon Doe - 2',
      email: 'jhondoe2@mail.com',
      username: 'jhon.doe2',
      password: 'jhon123'
    })

    await usersRepository.create({
      name: 'Jhon Doe - 3',
      email: 'jhondoe3@mail.com',
      username: 'jhon.doe3',
      password: 'jhon123'
    })

    const usersList = await listUsersService.execute({
      page: 2, perPage: 1
    })

    expect(usersList).toHaveLength(1)
    expect(usersList[0].id).toEqual(secondUser.id)
  })
})
