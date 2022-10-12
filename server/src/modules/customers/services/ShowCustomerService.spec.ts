import 'reflect-metadata'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { ShowCustomerService } from './ShowCustomerService'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let usersRepository: IUsersRepository
let showCustomerService: ShowCustomerService

describe('ShowCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    usersRepository = new FakeUsersRepository()
    showCustomerService = new ShowCustomerService(
      customersRepository,
      usersRepository,
    )
  })

  it('should be able to show customer', async () => {
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

    const customerData = await showCustomerService.execute({
      authenticatedUserId: authenticatedUser.id,
      customerId: createdCustomer.id,
    })

    expect(customerData).toEqual(createdCustomer)
  })

  it('should not be able to show a non-existent customer', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      showCustomerService.execute({
        authenticatedUserId: authenticatedUser.id,
        customerId: 'invalid-customer-id',
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })

  it('should not be able to show customer without authentication', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    await expect(
      showCustomerService.execute({
        authenticatedUserId: 'invalid-customer-id',
        customerId: createdCustomer.id,
      })
    ).rejects.toEqual(new AppError('You must be authenticated!', 401))
  })
})
