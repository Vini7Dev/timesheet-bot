import 'reflect-metadata'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { CreateCustomerService } from './CreateCustomerService'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let createCustomerService: CreateCustomerService

describe('CreateCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    createCustomerService = new CreateCustomerService(
      customersRepository,
    )
  })

  it('should be able to create customer', async () => {
    const createdCustomer = await createCustomerService.execute({
      name: 'Customer Example',
      code: '0123456789',
    })

    expect(createdCustomer).toHaveProperty('id')
    expect(createdCustomer).toHaveProperty('created_at')
    expect(createdCustomer).toHaveProperty('updated_at')
  })

  it('should not be able to create customer with code already exists', async () => {
    await createCustomerService.execute({
      name: 'First Customer',
      code: '0123456789',
    })

    await expect(
      createCustomerService.execute({
        name: 'First Customer',
        code: '0123456789',
      })
    ).rejects.toEqual(new AppError('This code already exists!'))
  })
})
