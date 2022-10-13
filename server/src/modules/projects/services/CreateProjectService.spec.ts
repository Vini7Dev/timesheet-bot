import { CustomersRepository } from '@modules/customers/infra/prisma/repositorires/CustomersRepository'
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { AppError } from '@shared/errors/AppError'
import { FakeProjectsRepository } from '../repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '../repositories/IProjectsRepository'
import { CreateProjectService } from './CreateProjectService'

let projectsRepository: IProjectsRepository
let customersRepository: ICustomersRepository
let createProjectService: CreateProjectService

describe('CreateProjectService', () => {
  beforeEach(() => {
    projectsRepository = new FakeProjectsRepository()
    customersRepository = new CustomersRepository()
    createProjectService = new CreateProjectService(
      projectsRepository,
      customersRepository,
    )
  })

  it('should be able to create project', async () => {
    const customerOwner = await customersRepository.create({
      code: '0123456789',
      name: 'Customer Example',
    })

    const createdProject = await createProjectService.execute({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: customerOwner.id,
    })

    expect(createdProject).toHaveProperty('id')
    expect(createdProject).toHaveProperty('created_at')
    expect(createdProject).toHaveProperty('updated_at')
  })

  it('should no be able to create project with code already exists', async () => {
    const customerOwner = await customersRepository.create({
      code: '0123456789',
      name: 'Customer Example',
    })

    await createProjectService.execute({
      code: 'SAME_CODE',
      name: 'Project Example 1',
      customer_id: customerOwner.id,
    })

    await expect(
      createProjectService.execute({
        code: 'SAME_CODE',
        name: 'Project Example 2',
        customer_id: customerOwner.id,
      })
    ).rejects.toEqual(new AppError('This code already exists!'))
  })

  it('should not be able to create project without a existent customer', async () => {
    await expect(
      createProjectService.execute({
        code: 'ABCDE',
        name: 'Project Example',
        customer_id: 'invalid-customer-id',
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })
})
