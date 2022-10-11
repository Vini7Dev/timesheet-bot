import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  name: string
  code: string
  authenticatedUserId: string
}

@injectable()
export class CreateCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    code,
    name,
    authenticatedUserId,
  }: IServiceProps) {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)
    if (!authenticatedUser) {
      throw new AppError('You must be authenticated!', 401)
    }

    const customerWithSameCode = await this.customersRepository.findByCode(code)
    if(customerWithSameCode) {
      throw new AppError('This code already exists!')
    }

    const createdCustomer = await this.customersRepository.create({
      code,
      name,
    })

    return createdCustomer
  }
}