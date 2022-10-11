import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'
import { Customer } from '../infra/prisma/entities/Customer'
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  code?: string
  name?: string
  customerId: string
  authenticatedUserId: string
}

export class UpdateCustomerService {
  constructor (
    private customersRepository: ICustomersRepository,

    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    authenticatedUserId,
    customerId,
    code,
    name,
  }: IServiceProps): Promise<Customer> {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)
    if (!authenticatedUser) {
      throw new AppError('You must be authenticated!', 401)
    }

    const customerToUpdate = await this.customersRepository.findById(customerId)
    if (!customerToUpdate) {
      throw new AppError('Customer not found!', 404)
    }

    const customerWithSameCode = await this.customersRepository.findByCode(code ?? '')
    if(customerWithSameCode) {
      throw new AppError('This code already exists!')
    }

    const dataToUpdateCustomer = {
      id: customerId,
      code: code ?? customerToUpdate.code,
      name: name ?? customerToUpdate.name,

    }

    const updatedProfile = await this.customersRepository.update(dataToUpdateCustomer)

    return updatedProfile
  }
}
