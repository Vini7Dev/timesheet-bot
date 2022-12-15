import 'reflect-metadata'

import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { ShowCustomerService } from './ShowCustomerService'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let showCustomerService: ShowCustomerService

describe('ShowCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    showCustomerService = new ShowCustomerService(
      customersRepository,
    )
  })

  it('should be able to show customer', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    const customerData = await showCustomerService.execute({
      customer_id: createdCustomer.id,
    })

    expect(customerData).toEqual(createdCustomer)
  })

  it('should not be able to show a non-existent customer', async () => {
    await expect(
      showCustomerService.execute({
        customer_id: 'invalid-customer-id',
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })
})
