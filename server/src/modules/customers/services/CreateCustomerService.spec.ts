import 'reflect-metadata'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { CreateCustomerService } from './CreateCustomerService'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let usersRepository: IUsersRepository
let createCustomerService: CreateCustomerService

describe('CreateCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    usersRepository = new FakeUsersRepository()
    createCustomerService = new CreateCustomerService(
      customersRepository,
      usersRepository,
    )
  })

  it('should be able to create customer', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdCustomer = await createCustomerService.execute({
      name: 'Customer Example',
      code: '0123456789',
      authenticatedUserId: authenticatedUser.id,
    })

    expect(createdCustomer).toHaveProperty('id')
    expect(createdCustomer).toHaveProperty('created_at')
    expect(createdCustomer).toHaveProperty('updated_at')
  })

  it('should not be able to create customer with code already exists', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await createCustomerService.execute({
      name: 'First Customer',
      code: '0123456789',
      authenticatedUserId: authenticatedUser.id,
    })

    await expect(
      createCustomerService.execute({
        name: 'First Customer',
        code: '0123456789',
        authenticatedUserId: authenticatedUser.id,
      })
    ).rejects.toEqual(new AppError('This code already exists!'))
  })

  it('should not be able to create customer without authentication', async () => {
    await expect(
      createCustomerService.execute({
        name: 'Customer Example',
        code: '0123456789',
        authenticatedUserId: '',
      })
    ).rejects.toEqual(new AppError('You must be authenticated!', 401))
  })
})
