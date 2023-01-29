import MarkingsOnTimesheetJob from './MarkingsOnTimesheetJob'
import { TRIGGER_MARKINGS_TO_TIMESHEET } from '@utils/constants'
import { AppError } from '@shared/errors/AppError'
import { IPubSub } from '@shared/infra/apollo/models/IPubSub'
import { ICrawler } from '@shared/containers/providers/Crawler/models/ICrawler'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { FakeCrawlerProvider } from '@shared/containers/providers/Crawler/fakes/FakeCrawlerProvider'
import { FakeEncryptProvider } from '@shared/containers/providers/Encrypt/fakes/FakeEncryptProvider'
import { FakePubSub } from '@shared/infra/apollo/fakes/FakePubSub'
import { FakeMarkingsRepository } from '@modules/markings/repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { FakeProjectsRepository } from '@modules/projects/repositories/fakes/FakeProjectsRepository'
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { FakeCustomersRepository } from '@modules/customers/repositories/fakes/FakeCustomersRepository'

let pubSub: IPubSub
let customersRepository: ICustomersRepository
let projectsRepository: IProjectsRepository
let usersRepository: IUsersRepository
let markingsRepository: IMarkingsRepository
let crawlerProvider: ICrawler
let encryptProvider: IEncrypt
let markingsOnTimesheetJob: typeof MarkingsOnTimesheetJob

let providers: {
  usersRepository: IUsersRepository,
  markingsRepository: IMarkingsRepository,
  crawlerProvider: ICrawler,
  encryptProvider: IEncrypt
}

describe('MarkingsOnTimesheetJob', () => {
  beforeEach(() => {
    pubSub = new FakePubSub()
    customersRepository = new FakeCustomersRepository()
    projectsRepository = new FakeProjectsRepository()
    usersRepository = new FakeUsersRepository()
    markingsRepository = new FakeMarkingsRepository()
    crawlerProvider = new FakeCrawlerProvider()
    encryptProvider = new FakeEncryptProvider()
    markingsOnTimesheetJob = MarkingsOnTimesheetJob

    providers = {
      usersRepository,
      markingsRepository,
      crawlerProvider,
      encryptProvider
    }
  })

  it('should be able to send markings to timesheet', async () => {
    const pubSubPublishSpy = jest.spyOn(pubSub, 'publish')

    const userOwner = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const customerExample = await customersRepository.create({
      code: 'CUSTOMER',
      name: 'Customer Example',
    })

    const projectExample = await projectsRepository.create({
      code: 'PROJECT',
      name: 'Project Example',
      customer_id: customerExample.id,
    })

    const markingToSave = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: projectExample.id,
      user_id: userOwner.id
    })

    const markingToUpdate = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: projectExample.id,
      user_id: userOwner.id,
      on_timesheet_id: 'any-timesheet-id',
      on_timesheet_status: 'SENT'
    })

    const markingToDelete = await markingsRepository.create({
      description: 'Description Example - 3',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: projectExample.id,
      on_timesheet_id: 'any-timesheet-id',
      on_timesheet_status: 'SENT',
      deleted_at: 'any-deleted-at',
      user_id: userOwner.id,
    })

    const markingToSavePayload = {
      ...markingToSave,
      project: { ...projectExample, customer: customerExample },
    }

    const markingToUpdatePayload = {
      ...markingToUpdate,
      project: { ...projectExample, customer: customerExample },
    }

    const markingToDeletePayload = {
      ...markingToDelete,
      project: { ...projectExample, customer: customerExample },
    }

    await markingsOnTimesheetJob.handle({
      pubSub,
      providers,
      data: {
        userOwnerId: userOwner.id,
        markings: [markingToSavePayload, markingToUpdatePayload, markingToDeletePayload]
      }
    })

    expect(pubSubPublishSpy).toHaveBeenCalledTimes(1)
    expect(pubSubPublishSpy).toHaveBeenCalledWith(TRIGGER_MARKINGS_TO_TIMESHEET, {
      userOwnerId: userOwner.id,
      onSendMarkingsToTimesheet: [
        {
          id: markingToSave.id,
          on_timesheet_status: 'SENT',
        },
        {
          id: markingToUpdate.id,
          on_timesheet_status: 'SENT',
        },
        {
          id: markingToDelete.id,
          on_timesheet_status: 'NOT_SENT',
        },
      ],
    })
  })

  it('should be able to recive marking timesheet error on send', async () => {
    jest.spyOn(crawlerProvider, 'saveTimesheetTasks')
      .mockImplementationOnce(async ({ markings }) => ({
        markingsResponse: markings.map(marking => ({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: ['Any marking timesheet error on save']
        }))
      }))

    jest.spyOn(crawlerProvider, 'updateTimesheetTasks')
      .mockImplementationOnce(async ({ markings }) => ({
        markingsResponse: markings.map(marking => ({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: ['Any marking timesheet error on update']
        }))
      }))

    jest.spyOn(crawlerProvider, 'deleteTimesheetTasks')
      .mockImplementationOnce(async ({ markings }) => ({
        markingsResponse: markings.map(marking => ({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: ['Any marking timesheet error on delete']
        }))
      }))

    const pubSubPublishSpy = jest.spyOn(pubSub, 'publish')

    const userOwner = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const markingToSave = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: userOwner.id
    })

    const markingToUpdate = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: userOwner.id,
      on_timesheet_id: 'any-timesheet-id',
      on_timesheet_status: 'SENT'
    })

    const markingToDelete = await markingsRepository.create({
      description: 'Description Example - 3',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      on_timesheet_id: 'any-timesheet-id',
      on_timesheet_status: 'SENT',
      deleted_at: 'any-deleted-at',
      user_id: userOwner.id,
    })

    await markingsOnTimesheetJob.handle({
      pubSub,
      providers,
      data: {
        userOwnerId: userOwner.id,
        markings: [markingToSave, markingToUpdate, markingToDelete]
      }
    })

    expect(pubSubPublishSpy).toHaveBeenCalledTimes(1)
    expect(pubSubPublishSpy).toHaveBeenCalledWith(TRIGGER_MARKINGS_TO_TIMESHEET, {
      userOwnerId: userOwner.id,
      onSendMarkingsToTimesheet: [
        {
          id: markingToSave.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: 'Any marking timesheet error on save'
        },
        {
          id: markingToUpdate.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: 'Any marking timesheet error on update'
        },
        {
          id: markingToDelete.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: 'Any marking timesheet error on delete'
        },
      ],
    })
  })

  it('should not be able to send markings with a non-existent user', async () => {
    await expect(
      markingsOnTimesheetJob.handle({
        pubSub,
        providers,
        data: {
          userOwnerId: 'invalid-user-id',
          markings: []
        }
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it("should not be able to send the markings to the timesheet if there are any from another user", async () => {
    const differentUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const otherUserMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    await expect(
      markingsOnTimesheetJob.handle({
        pubSub,
        providers,
        data: {
          userOwnerId: differentUser.id,
          markings: [otherUserMarking]
        }
      })
    ).rejects.toEqual(new AppError('You do not have permission to send one of these marking!', 403))
  })

  it('should not be able to send markings if there are any with status sending on timesheet', async () => {
    const userOwner = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const markingWithSendingStatus = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: userOwner.id,
      on_timesheet_status: 'SENDING',
    })

    await expect(
      markingsOnTimesheetJob.handle({
        pubSub,
        providers,
        data: {
          userOwnerId: userOwner.id,
          markings: [markingWithSendingStatus]
        }
      })
    ).rejects.toEqual(new AppError('One of these markings is being processed in the timesheet!'))
  })

  it('should not be able to send markings when an unexpected error occurred', async () => {
    jest.spyOn(crawlerProvider, 'authenticateOnTimesheet')
      .mockImplementationOnce(async () => {
        throw new Error('Unexpected error example')
      })

    const pubSubPublishSpy = jest.spyOn(pubSub, 'publish')

    const userOwner = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123'
    })

    const markingToSave = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: userOwner.id,
    })

    await markingsOnTimesheetJob.handle({
      pubSub,
      providers,
      data: {
        userOwnerId: userOwner.id,
        markings: [markingToSave]
      }
    })

    expect(pubSubPublishSpy).toHaveBeenCalled()
    expect(pubSubPublishSpy).toHaveBeenCalledWith(TRIGGER_MARKINGS_TO_TIMESHEET, {
      userOwnerId: userOwner.id,
      onSendMarkingsToTimesheet: [
        {
          id: markingToSave.id,
          on_timesheet_status: 'NOT_SENT',
        },
      ],
    })
  })
})
