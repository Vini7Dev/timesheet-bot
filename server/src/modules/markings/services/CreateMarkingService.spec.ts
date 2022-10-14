import 'reflect-metadata'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { UsersRepository } from '@modules/users/infra/prisma/repositories/UsersRepository'
import { ProjectsRepository } from '@modules/projects/infra/prisma/repositories/ProjectsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { CreateMarkingService } from './CreateMarkingService'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { AppError } from '@shared/errors/AppError'

enum WorkClass {
  PRODUCTION,
  ABSENCE
}

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let projectsRepository: IProjectsRepository
let createMarkingService: CreateMarkingService

describe('CreateMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new UsersRepository()
    projectsRepository = new ProjectsRepository()
    createMarkingService = new CreateMarkingService(
      markingsRepository,
      usersRepository,
      projectsRepository,
    )
  })

  it('should be able to create marking', async () => {
    const userReference = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await createMarkingService.execute({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: userReference.id,
    })

    expect(createdMarking).toHaveProperty('id')
    expect(createdMarking).toHaveProperty('created_at')
    expect(createdMarking).toHaveProperty('updated_at')
  })

  it('should not be able to create marking with a non-existent user', async () => {
    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    await expect(
      createMarkingService.execute({
        description: 'Description Example',
        date: '01/01/2022',
        start_time: '09:00',
        finish_time: '12:00',
        start_interval_time: '10:00',
        finish_interval_time: '11:00',
        work_class: WorkClass.PRODUCTION,
        project_id: projectReference.id,
        user_id: 'invalid-user-id',
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it('should not be able to create marking with a non-existent project', async () => {
    const userReference = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      createMarkingService.execute({
        description: 'Description Example',
        date: '01/01/2022',
        start_time: '09:00',
        finish_time: '12:00',
        start_interval_time: '10:00',
        finish_interval_time: '11:00',
        work_class: WorkClass.PRODUCTION,
        project_id: 'invalid-project-id',
        user_id: userReference.id,
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })

  it('should not be able to create markings with parallel date time', async () => {
    const userReference = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    await createMarkingService.execute({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: userReference.id,
    })

    await expect(
      createMarkingService.execute({
        description: 'Description Example 2',
        date: '01/01/2022',
        start_time: '11:00',
        finish_time: '14:00',
        start_interval_time: '10:00',
        finish_interval_time: '11:00',
        work_class: WorkClass.PRODUCTION,
        project_id: projectReference.id,
        user_id: userReference.id,
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!', 422)
    )
  })
})
