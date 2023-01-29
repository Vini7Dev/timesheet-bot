import 'reflect-metadata'

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
    const authenticatedUser = await usersRepository.create({
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
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const markingsList = await listMarkingsByUserService.execute({
      authenticatedUserId: authenticatedUser.id
    })

    expect(markingsList).toHaveLength(1)
    expect(markingsList[0].id).toEqual(createdMarking.id)
    expect(markingsList[0].user_id).toEqual(authenticatedUser.id)
  })

  it('should be able to list markings by user with pagination filters', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    await markingsRepository.create({
      description: 'First Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const secondMarking = await markingsRepository.create({
      description: 'Second Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const thirdMarking = await markingsRepository.create({
      description: 'Third Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const markingsList = await listMarkingsByUserService.execute({
      authenticatedUserId: authenticatedUser.id,
      search: 'd marking'
    })

    expect(markingsList).toHaveLength(2)
    expect(markingsList[0].id).toEqual(secondMarking.id)
    expect(markingsList[0].user_id).toEqual(authenticatedUser.id)
    expect(markingsList[1].id).toEqual(thirdMarking.id)
    expect(markingsList[1].user_id).toEqual(authenticatedUser.id)
  })

  it('should be able to list markings with search filter', async () => {
    const authenticatedUser = await usersRepository.create({
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
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const secondMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    await markingsRepository.create({
      description: 'Description Example - 3',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const markingsList = await listMarkingsByUserService.execute({
      authenticatedUserId: authenticatedUser.id,
      page: 1,
      perPage: 1
    })

    expect(markingsList).toHaveLength(1)
    expect(markingsList[0].id).toEqual(secondMarking.id)
    expect(markingsList[0].user_id).toEqual(authenticatedUser.id)
  })

  it('should not be able to list markings from an non-existent user', async () => {
    await expect(
      listMarkingsByUserService.execute({
        authenticatedUserId: 'non-existent-id'
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })
})
