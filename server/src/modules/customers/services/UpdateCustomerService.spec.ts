import 'reflect-metadata'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeCustomersRepository } from '../repositories/fakes/FakeCustomersRepository'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { UpdateCustomerService } from './UpdateCustomerService'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { AppError } from '@shared/errors/AppError'

let customersRepository: ICustomersRepository
let usersRepository: IUsersRepository
let updateCustomerService: UpdateCustomerService

describe('UpdateCustomerService', () => {
  beforeEach(() => {
    customersRepository = new FakeCustomersRepository()
    usersRepository = new FakeUsersRepository()
    updateCustomerService = new UpdateCustomerService(
      customersRepository,
      usersRepository,
    )
  })

  it('should be able to update customer', async () => {
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

    const updatedCustomer = await updateCustomerService.execute({
      authenticatedUserId: authenticatedUser.id,
      customerId: createdCustomer.id,
      name: 'Updated Customer Example',
      code: '9876543210',
    })

    expect(updatedCustomer).toHaveProperty('id')
    expect(updatedCustomer.id).toEqual(createdCustomer.id)
    expect(updatedCustomer.name).toEqual('Updated Customer Example')
    expect(updatedCustomer.code).toEqual('9876543210')
    expect(updatedCustomer.updated_at).not.toEqual(updatedCustomer.created_at)
  })

  it('should be able to proccess request without changes', async () => {
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

    const updatedCustomer = await updateCustomerService.execute({
      authenticatedUserId: authenticatedUser.id,
      customerId: createdCustomer.id,
    })

    expect(updatedCustomer).toHaveProperty('id')
    expect(updatedCustomer.id).toEqual(createdCustomer.id)
    expect(updatedCustomer.name).toEqual(createdCustomer.name)
    expect(updatedCustomer.code).toEqual(createdCustomer.code)
    expect(updatedCustomer.updated_at).not.toEqual(updatedCustomer.created_at)
  })

  it('should not be able to update a non-existent customer', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      updateCustomerService.execute({
        authenticatedUserId: authenticatedUser.id,
        customerId: 'invalid-customer-id',
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })

  it('should not be able to update customer with an code already exists', async () => {
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

    await expect(
      updateCustomerService.execute({
        authenticatedUserId: authenticatedUser.id,
        customerId: secondCustomer.id,
        name: 'Updated Customer Example - 2',
        code: '1111111111',
      })
    ).rejects.toEqual(new AppError('This code already exists!'))
  })

  it('should no be able to update customer without authentication', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '0123456789',
    })

    await expect(
      updateCustomerService.execute({
        authenticatedUserId: 'invalid-user-id',
        customerId: createdCustomer.id,
        name: 'Updated Customer Example',
        code: '9876543210',
      })
    ).rejects.toEqual(new AppError('You must be authenticated!', 401))
  })
})
