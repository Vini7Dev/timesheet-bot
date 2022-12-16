import 'reflect-metadata'

import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { ListCustomersService } from './ListCustomersService'

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
      name: 'First Customer Example',
      code: '1111111111',
    })

    const secondCustomer = await customersRepository.create({
      name: 'Second Customer Example',
      code: '2222222222',
    })

    await customersRepository.create({
      name: 'Third Customer Example',
      code: '3333333333',
    })

    const customersList = await listCustomersService.execute({
      page: 1,
      perPage: 1,
    })

    expect(customersList).toHaveLength(1)
    expect(customersList[0].id).toEqual(secondCustomer.id)
  })

  it('should be able to list customers with search filter', async () => {
    await customersRepository.create({
      name: 'First Customer Example',
      code: '1111111111',
    })

    const secondCustomer = await customersRepository.create({
      name: 'Second Customer Example',
      code: '2222222222',
    })

    const thirdCustomer = await customersRepository.create({
      name: 'Third Customer Example',
      code: '3333333333',
    })

    const customersList = await listCustomersService.execute({
      search: 'd custo'
    })

    expect(customersList).toHaveLength(2)
    expect(customersList[0].id).toEqual(secondCustomer.id)
    expect(customersList[1].id).toEqual(thirdCustomer.id)
  })
})
