import 'reflect-metadata'

import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { DeleteCustomerService } from './DeleteCustomerService'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let deleteCustomerService: DeleteCustomerService

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    deleteCustomerService = new DeleteCustomerService(
      customersRepository,
    )
  })

  it('should be able to delete customer', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    const result = await deleteCustomerService.execute({
      customer_id: createdCustomer.id,
    })

    expect(result).toEqual(createdCustomer.id)
  })

  it('should not be able to delete a non-existent customer', async () => {
    await expect(
      deleteCustomerService.execute({
        customer_id: 'invalid-customer-id',
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })
})
