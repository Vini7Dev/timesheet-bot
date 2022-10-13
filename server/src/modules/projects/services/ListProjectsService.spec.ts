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
      name: 'Project Example - 1',
      code: 'ABCDE',
      customer_id: 'any-customer-id',
    })

    const secondProject = await projectsRepository.create({
      name: 'Project Example - 2',
      code: 'FGHIJ',
      customer_id: 'any-customer-id',
    })

    await projectsRepository.create({
      name: 'Project Example - 3',
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
})
