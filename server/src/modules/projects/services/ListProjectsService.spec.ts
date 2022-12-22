import 'reflect-metadata'

import { FakeProjectsRepository } from '../repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '../repositories/IProjectsRepository'
import { ListProjectsService } from './ListProjectsService'

let projectsRepository: IProjectsRepository
let listProjectsService: ListProjectsService

describe('ListProjectsService', () => {
  beforeEach(() => {
    projectsRepository = new FakeProjectsRepository()
    listProjectsService = new ListProjectsService(
      projectsRepository,
    )
  })

  it('should be able to list projects', async () => {
    const createdProject = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const projectsList = await listProjectsService.execute({})

    expect(projectsList).toHaveLength(1)
    expect(projectsList[0].id).toEqual(createdProject.id)
  })

  it('should be able to list projects with pagination filters', async () => {
    await projectsRepository.create({
      name: 'Fist Project Example',
      code: 'ABCDE',
      customer_id: 'any-customer-id',
    })

    const secondProject = await projectsRepository.create({
      name: 'Second Project Example',
      code: 'FGHIJ',
      customer_id: 'any-customer-id',
    })

    const thirdCustomer = await projectsRepository.create({
      name: 'Third Project Example',
      code: 'KLMNO',
      customer_id: 'any-customer-id',
    })

    const projectsList = await listProjectsService.execute({
      page: 1,
      perPage: 1,
    })

    expect(projectsList).toHaveLength(1)
    expect(projectsList[0].id).toEqual(secondProject.id)
  })

  it('should be able to list projects with search filter', async () => {
    await projectsRepository.create({
      name: 'Fist Project Example',
      code: 'ABCDE',
      customer_id: 'any-customer-id',
    })

    const secondProject = await projectsRepository.create({
      name: 'Second Project Example',
      code: 'FGHIJ',
      customer_id: 'any-customer-id',
    })

    const thirdProject = await projectsRepository.create({
      name: 'Third Project Example',
      code: 'KLMNO',
      customer_id: 'any-customer-id',
    })

    const customersList = await listProjectsService.execute({
      search: 'd proje'
    })

    expect(customersList).toHaveLength(2)
    expect(customersList[0].id).toEqual(secondProject.id)
    expect(customersList[1].id).toEqual(thirdProject.id)
  })
})
