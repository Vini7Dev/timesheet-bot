import 'reflect-metadata'

import { WorkClass } from '@prisma/client'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { CreateMarkingService } from './CreateMarkingService'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { AppError } from '@shared/errors/AppError'
import { FakeProjectsRepository } from '@modules/projects/repositories/fakes/FakeProjectsRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let projectsRepository: IProjectsRepository
let createMarkingService: CreateMarkingService

describe('CreateMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new FakeUsersRepository()
    projectsRepository = new FakeProjectsRepository()
    createMarkingService = new CreateMarkingService(
      markingsRepository,
      usersRepository,
      projectsRepository,
    )
  })

  it('should be able to create marking', async () => {
    const authenticatedUser = await usersRepository.create({
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
      authenticatedUserId: authenticatedUser.id,
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
        authenticatedUserId: 'invalid-user-id',
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it('should not be able to create marking with a non-existent project', async () => {
    const authenticatedUser = await usersRepository.create({
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
        authenticatedUserId: authenticatedUser.id,
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })

  it('should not be able to create markings with parallel date time', async () => {
    const authenticatedUser = await usersRepository.create({
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
      description: 'Description Example 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    })

    const dataToCreateMarkingWithoutTimes = {
      description: 'Description Example 2',
      date: '01/01/2022',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutTimes,
        start_time: '11:00',
        finish_time: '14:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutTimes,
        start_time: '08:00',
        finish_time: '10:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutTimes,
        start_time: '10:00',
        finish_time: '11:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )
  })

  it('should not be able to create marking when only one of interval of the times are received', async () => {
    const authenticatedUser = await usersRepository.create({
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

    const dataToCreateMarkingWithoutIntervalTimes = {
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        start_interval_time: '10:00',
      })
    ).rejects.toEqual(new AppError('Only one of interval times was received!'))

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        finish_interval_time: '11:00',
      })
    ).rejects.toEqual(new AppError('Only one of interval times was received!'))
  })

  it('should not be able to create marking with interval times outsite the start and finish time range', async () => {
    const authenticatedUser = await usersRepository.create({
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

    const dataToCreateMarkingWithoutIntervalTimes = {
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        start_interval_time: '08:00',
        finish_interval_time: '10:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        start_interval_time: '10:00',
        finish_interval_time: '13:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        start_interval_time: '13:00',
        finish_interval_time: '14:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      createMarkingService.execute({
        ...dataToCreateMarkingWithoutIntervalTimes,
        start_interval_time: '07:00',
        finish_interval_time: '08:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))
  })
})
