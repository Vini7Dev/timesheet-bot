import 'reflect-metadata'

import { AppError } from '@shared/errors/AppError'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { ShowMarkingService } from './ShowMarkingService'

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let showMarkingService: ShowMarkingService

describe('ShowMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new FakeUsersRepository()
    showMarkingService = new ShowMarkingService(
      markingsRepository,
      usersRepository,
    )
  })

  it('should be able to show marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
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

    const findedMarking = await showMarkingService.execute({
      authenticatedUserId: authenticatedUser.id,
      marking_id: createdMarking.id,
    })

    expect(findedMarking).toEqual(createdMarking)
  })

  it('should not be able to show a non-existent marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      showMarkingService.execute({
        authenticatedUserId: authenticatedUser.id,
        marking_id: 'invalid-marking-id',
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })

  it('should not be able to view marking with a non-existent user', async () => {
    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'invalid-user-id'
    })

    await expect(
      showMarkingService.execute({
        authenticatedUserId: 'invalid-user-id',
        marking_id: createdMarking.id,
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it("should not be able to view different user's marking", async () => {
    const differentUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
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
      user_id: 'any-user-id'
    })

    await expect(
      showMarkingService.execute({
        authenticatedUserId: differentUser.id,
        marking_id: createdMarking.id,
      })
    ).rejects.toEqual(new AppError('You do not have permission to view this marking!', 403))
  })
})
