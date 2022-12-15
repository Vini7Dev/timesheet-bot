import 'reflect-metadata'

import { FakeProjectsRepository } from '../repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '../repositories/IProjectsRepository'
import { UpdateProjectService } from './UpdateProjectService'
import { AppError } from '@shared/errors/AppError'
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { FakeCustomersRepository } from '@modules/customers/repositories/fakes/FakeCustomersRepository'

let projectsRepository: IProjectsRepository
let customersRepository: ICustomersRepository
let updateProjectService: UpdateProjectService

describe('UpdateProjectService', () => {
  beforeEach(() => {
    projectsRepository = new FakeProjectsRepository()
    customersRepository = new FakeCustomersRepository()
    updateProjectService = new UpdateProjectService(
      projectsRepository,
      customersRepository,
    )
  })

  it('should be able to update project', async () => {
    const createdCustomer = await customersRepository.create({
      name: 'Customer Example',
      code: '12345',
    })

    const createdProject = await projectsRepository.create({
      name: 'Project Example',
      code: 'ABCDE',
      customer_id: 'any-project-id',
    })

    const updatedProject = await updateProjectService.execute({
      project_id: createdProject.id,
      name: 'Updated Project Example',
      code: 'VWXYZ',
      customer_id: createdCustomer.id
    })

    expect(updatedProject).toHaveProperty('id')
    expect(updatedProject.id).toEqual(createdProject.id)
    expect(updatedProject.name).toEqual('Updated Project Example')
    expect(updatedProject.code).toEqual('VWXYZ')
    expect(updatedProject.customer_id).toEqual(createdCustomer.id)
    expect(updatedProject.updated_at).not.toEqual(updatedProject.created_at)
  })

  it('should be able to proccess request without changes', async () => {
    const createdProject = await projectsRepository.create({
      name: 'Project Example',
      code: 'ABCDE',
      customer_id: 'any-project-id',
    })

    const updatedProject = await updateProjectService.execute({
      project_id: createdProject.id,
    })

    expect(updatedProject).toHaveProperty('id')
    expect(updatedProject.id).toEqual(createdProject.id)
    expect(updatedProject.name).toEqual(createdProject.name)
    expect(updatedProject.code).toEqual(createdProject.code)
    expect(updatedProject.updated_at).not.toEqual(updatedProject.created_at)
  })

  it('should not be able to update project with a non-existent customer', async () => {
    const createdProject = await projectsRepository.create({
      name: 'Project Example - 1',
      code: 'ABCDE',
      customer_id: 'any-project-id',
    })

    await expect(
      updateProjectService.execute({
        project_id: createdProject.id,
        name: 'Project Example - 2',
        code: 'VWXYZ',
        customer_id: 'non-existent-customer'
      })
    ).rejects.toEqual(new AppError('Customer not found!', 404))
  })

  it('should not be able to update a non-existent project', async () => {
    await expect(
      updateProjectService.execute({
        project_id: 'invalid-project-id',
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })

  it('should not be able to update project with an code already exists', async () => {
    await projectsRepository.create({
      name: 'Project Example - 1',
      code: 'ABCDE',
      customer_id: 'any-project-id',
    })

    const secondProject = await projectsRepository.create({
      name: 'Project Example - 2',
      code: 'VWXYZ',
      customer_id: 'any-project-id',
    })

    await expect(
      updateProjectService.execute({
        project_id: secondProject.id,
        name: 'Updated Project Example - 2',
        code: 'ABCDE',
      })
    ).rejects.toEqual(new AppError('This code already exists!'))
  })
})
