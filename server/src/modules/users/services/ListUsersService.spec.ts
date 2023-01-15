import 'reflect-metadata'

import { AppError } from '@shared/errors/AppError'
import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { ListUsersService } from './ListUsersService'

let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let listUsersService: ListUsersService

describe('ListUsersService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    listUsersService = new ListUsersService(
      usersRepository,
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

    const usersList = await listUsersService.execute({ page: 1, perPage: 1 })

    expect(usersList).toHaveLength(1)
    expect(usersList[0].id).toEqual(secondUser.id)
  })

  it('should be able to list customers with search filter', async () => {
    await usersRepository.create({
      name: 'First User',
      email: 'jhondoe1@mail.com',
      username: 'jhon.doe1',
      password: 'jhon123'
    })

    const secondUser = await usersRepository.create({
      name: 'Second User',
      email: 'jhondoe2@mail.com',
      username: 'jhon.doe2',
      password: 'jhon123'
    })

    const thirdUser = await usersRepository.create({
      name: 'Third User',
      email: 'jhondoe3@mail.com',
      username: 'jhon.doe3',
      password: 'jhon123'
    })

    const usersList = await listUsersService.execute({
      search: 'd user'
    })

    expect(usersList).toHaveLength(2)
    expect(usersList[0].id).toEqual(secondUser.id)
    expect(usersList[1].id).toEqual(thirdUser.id)
  })
})
