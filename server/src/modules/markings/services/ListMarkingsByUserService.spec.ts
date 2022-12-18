import 'reflect-metadata'

import { WorkClass } from '@prisma/client'

import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { ListMarkingsByUserService } from './ListMarkingsByUserService'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { AppError } from '@shared/errors/AppError'

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let listMarkingsByUserService: ListMarkingsByUserService

describe('ListMarkingsByUserService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new FakeUsersRepository()
    listMarkingsByUserService = new ListMarkingsByUserService(
      markingsRepository,
      usersRepository,
    )
  })

  it('should be able to list markings by user', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: createdUser.id
    })

    const markingsList = await listMarkingsByUserService.execute({
      user_id: createdUser.id
    })

    expect(markingsList).toHaveLength(1)
    expect(markingsList[0].id).toEqual(createdMarking.id)
    expect(markingsList[0].user_id).toEqual(createdUser.id)
  })

  it('should be able to list projects with pagination filters', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: createdUser.id
    })

    const secondMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: createdUser.id
    })

    await markingsRepository.create({
      description: 'Description Example - 3',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: createdUser.id
    })

    const projectsList = await listMarkingsByUserService.execute({
      page: 1,
      perPage: 1,
      user_id: createdUser.id
    })

    expect(projectsList).toHaveLength(1)
    expect(projectsList[0].id).toEqual(secondMarking.id)
    expect(projectsList[0].user_id).toEqual(createdUser.id)
  })

  it('should not be able to list markings from an non-existend user', async () => {
    await expect(
      listMarkingsByUserService.execute({
        user_id: 'non-existend-id'
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })
})
