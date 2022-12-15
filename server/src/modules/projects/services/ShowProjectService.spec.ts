import 'reflect-metadata'

import { FakeProjectsRepository } from '../repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '../repositories/IProjectsRepository'
import { ShowProjectService } from './ShowProjectService'
import { AppError } from '@shared/errors/AppError'

let projectsRepository: IProjectsRepository
let showProjectService: ShowProjectService

describe('ShowProjectService', () => {
  beforeEach(() => {
    projectsRepository = new FakeProjectsRepository()
    showProjectService = new ShowProjectService(
      projectsRepository,
    )
  })

  it('should be able to show project', async () => {
    const createdProject = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const findedProject = await showProjectService.execute({
      project_id: createdProject.id,
    })

    expect(findedProject).toEqual(createdProject)
  })

  it('should not be able to show a non-existent project', async () => {
    await expect(
      showProjectService.execute({
        project_id: 'invalid-project-id',
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })
})
