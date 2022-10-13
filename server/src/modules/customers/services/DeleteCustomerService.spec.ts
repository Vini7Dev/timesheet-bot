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
      customerId: createdCustomer.id,
    })

    expect(result).toEqual(createdCustomer.id)
  })
})
