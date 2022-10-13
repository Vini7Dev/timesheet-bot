import 'reflect-metadata'

import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { ListCustomersService } from './ListCustomersService'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let listCustomersService: ListCustomersService

describe('ListCustomersService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    listCustomersService = new ListCustomersService(
      customersRepository,
    )
  })

  it('should be able to list customers', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    const customersList = await listCustomersService.execute({})

    expect(customersList).toHaveLength(1)
    expect(customersList[0].id).toEqual(createdCustomer.id)
  })

  it('should be able to list customers with pagination filters', async () => {
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
      page: 1,
      perPage: 1,
    })

    expect(customersList).toHaveLength(1)
    expect(customersList[0].id).toEqual(secondCustomer.id)
  })
})
