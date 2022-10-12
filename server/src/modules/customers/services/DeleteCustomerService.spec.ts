import 'reflect-metadata'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { DeleteCustomerService } from './DeleteCustomerService'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let usersRepository: IUsersRepository
let deleteCustomerService: DeleteCustomerService

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    usersRepository = new FakeUsersRepository()
    deleteCustomerService = new DeleteCustomerService(
      customersRepository,
      usersRepository,
    )
  })

  it('should be able to delete customer', async () => {
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

    const result = await deleteCustomerService.execute({
      authenticatedUserId: authenticatedUser.id,
      customerId: createdCustomer.id,
    })

    expect(result).toEqual(createdCustomer.id)
  })

  it('should not be able to delete customer without authentication', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    await expect(
      deleteCustomerService.execute({
        authenticatedUserId: 'invalid-user-id',
        customerId: createdCustomer.id,
      })
    ).rejects.toEqual(new AppError('You must be authenticated!', 401))
  })
})
