import 'reflect-metadata'

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { ListCustomersService } from './ListCustomersService'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let usersRepository: IUsersRepository
let listCustomersService: ListCustomersService

describe('ListCustomersService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    usersRepository = new FakeUsersRepository()
    listCustomersService = new ListCustomersService(
      customersRepository,
      usersRepository,
    )
  })

  it('should be able to list customers', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    const customersList = await listCustomersService.execute({
      authenticatedUserId: authenticatedUser.id,
    })

    expect(customersList).toHaveLength(1)
    expect(customersList[0]).toEqual(createdCustomer.id)
  })

  it('should be able to list customers with pagination filters', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await customersRepository.create({
      name: 'Customer Example - 1',
      code: '1111111111',
    })

    const secondCustomer = await customersRepository.create({
      name: 'Customer Example - 2',
      code: '2222222222',
    })

    await customersRepository.create({
      name: 'Customer Example - 3',
      code: '3333333333',
    })

    const customersList = await listCustomersService.execute({
      page: 1, perPage: 1, authenticatedUserId: authenticatedUser.id,
    })

    expect(customersList).toHaveLength(1)
    expect(customersList[1]).toEqual(secondCustomer.id)
  })

  it('should not be able to list customers without authentication', async () => {
    await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    await expect(
      listCustomersService.execute({
        authenticatedUserId: 'invalid-user-id',
      })
    ).rejects.toEqual(new AppError('You must be authenticated', 401))
  })
})
