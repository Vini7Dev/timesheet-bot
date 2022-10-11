import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { Customer } from '../infra/prisma/entities/Customer';
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  authenticatedUserId: string
  page?: number
  perPage?: number
}

export class ListCustomersService {
  constructor (
    private customersRepository: ICustomersRepository,

    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    authenticatedUserId,
    page,
    perPage,
  }: IServiceProps): Promise<Customer[]> {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)

    if (!authenticatedUser) {
      throw new AppError('You must be authenticated!', 401)
    }

    const customersList = await this.customersRepository.list({ page, perPage })

    return customersList
  }
}
