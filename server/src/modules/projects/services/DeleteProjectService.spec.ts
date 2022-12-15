import 'reflect-metadata'

import { FakeProjectsRepository } from '../repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '../repositories/IProjectsRepository'
import { DeleteProjectService } from './DeleteProjectService'
import { AppError } from '@shared/errors/AppError'

let projectsRepository: IProjectsRepository
let deleteProjectService: DeleteProjectService

describe('DeleteProjectService', () => {
  beforeEach(() => {
    projectsRepository = new FakeProjectsRepository()
    deleteProjectService = new DeleteProjectService(
      projectsRepository,
    )
  })

  it('should be able to delete project', async () => {
    const projectToDelete = await projectsRepository.create({
      name: 'Project Example',
      code: 'ABCDE',
      customer_id: 'any-customer-id',
    })

    const result = await deleteProjectService.execute({
      project_id: projectToDelete.id
    })

    expect(result).toEqual(projectToDelete.id)
  })

  it('should not be able to delete a non-existent project', async () => {
    await expect(
      deleteProjectService.execute({
        project_id: 'invalid-project-id',
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })
})
