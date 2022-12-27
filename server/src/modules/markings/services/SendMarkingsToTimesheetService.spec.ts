import 'reflect-metadata'

import { WorkClass } from '@prisma/client'

import { JOB_MARKINGS_ON_TIMESHEET } from '@utils/constants'
import { QueueControl } from '@shared/infra/bull/QueueControl'
import { AppError } from '@shared/errors/AppError'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { SendMarkingsToTimesheetService } from './SendMarkingsToTimesheetService'

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let encryptProvider: IEncrypt
let sendMarkingsToTimesheetService: SendMarkingsToTimesheetService

describe('SendMarkingsToTimesheetService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new FakeUsersRepository()
    encryptProvider = new FakeEncryptProvider()
    sendMarkingsToTimesheetService = new SendMarkingsToTimesheetService(
      markingsRepository,
      usersRepository,
      encryptProvider,
    )
  })

  it('should be able to send markings to timesheet', async () => {
    const queueAddSpy = jest.spyOn(QueueControl, 'add').mockImplementationOnce(
      jest.fn()
    )

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
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const serviceResponse = await sendMarkingsToTimesheetService.execute({
      authenticatedUserId: authenticatedUser.id,
      markingIds: [createdMarking.id]
    })

    expect(serviceResponse.markings).toHaveLength(1)
    expect(serviceResponse.markings[0].id).toEqual(createdMarking.id)
    expect(serviceResponse.markings[0].error).toBeUndefined()
    expect(queueAddSpy).toHaveBeenCalledTimes(1)
    expect(queueAddSpy).toHaveBeenCalledWith({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        markings: [createdMarking],
        userCredentials: {
          user_id: authenticatedUser.id,
          username: authenticatedUser.username,
          password: authenticatedUser.password,
        }
      },
    })
  })

  it('should be able to send only existing markings to timesheet', async () => {
    const queueAddSpy = jest.spyOn(QueueControl, 'add').mockImplementationOnce(
      async ({ data }) => data
    )

    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const existentMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const serviceResponse = await sendMarkingsToTimesheetService.execute({
      authenticatedUserId: authenticatedUser.id,
      markingIds: [existentMarking.id, 'invalid-marking-id']
    })

    expect(serviceResponse.markings).toHaveLength(2)
    expect(serviceResponse.markings[0].id).toEqual(existentMarking.id)
    expect(serviceResponse.markings[0].error).toBeUndefined()

    expect(serviceResponse.markings[1].id).toEqual('invalid-marking-id')
    expect(serviceResponse.markings[1]).toHaveProperty('error')
    expect(serviceResponse.markings[1].error).toEqual(
      new AppError('Marking not found!', 404)
    )

    expect(queueAddSpy).toHaveBeenCalledTimes(1)
    expect(queueAddSpy).toHaveBeenCalledWith({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        markings: [existentMarking],
        userCredentials: {
          user_id: authenticatedUser.id,
          username: authenticatedUser.username,
          password: authenticatedUser.password,
        }
      },
    })
  })

  it('should not be able to send markings with a non-existent user', async () => {
    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    await expect(
      sendMarkingsToTimesheetService.execute({
        authenticatedUserId: 'invalid-user-id',
        markingIds: [createdMarking.id]
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it("should not be able to send another user's markings", async () => {
    const queueAddSpy = jest.spyOn(QueueControl, 'add').mockImplementationOnce(
      async ({ data }) => data
    )

    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const userMarking = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const anotherUserMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'another-user-id'
    })

    const serviceResponse = await sendMarkingsToTimesheetService.execute({
      authenticatedUserId: authenticatedUser.id,
      markingIds: [userMarking.id, anotherUserMarking.id]
    })

    expect(serviceResponse.markings).toHaveLength(2)
    expect(serviceResponse.markings[0].id).toEqual(userMarking.id)
    expect(serviceResponse.markings[0].error).toBeUndefined()

    expect(serviceResponse.markings[1].id).toEqual(anotherUserMarking.id)
    expect(serviceResponse.markings[1]).toHaveProperty('error')
    expect(serviceResponse.markings[1].error).toEqual(
      new AppError('You do not have permission to send this marking!', 403)
    )

    expect(queueAddSpy).toHaveBeenCalledTimes(1)
    expect(queueAddSpy).toHaveBeenCalledWith({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        markings: [userMarking],
        userCredentials: {
          user_id: authenticatedUser.id,
          username: authenticatedUser.username,
          password: authenticatedUser.password,
        }
      },
    })
  })
})
