import { inject, injectable } from 'tsyringe'
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { AppError } from '@shared/errors/AppError'
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  code: string
  name: string
  customer_id: string
}

@injectable()
export class CreateProjectService {
  constructor (
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    code,
    name,
    customer_id,
  }: IServiceProps) {
    const projectWithSameCode = await this.projectsRepository.findByCode(code)

    if (projectWithSameCode) {
      throw new AppError('This code already exists!')
    }

    const customerOwner = await this.customersRepository.findById(customer_id)

    if (!customerOwner) {
      throw new AppError('Customer not found!', 404)
    }

    const createdProject = await this.projectsRepository.create({
      code,
      name,
      customer_id,
    })

    return createdProject
  }
}
