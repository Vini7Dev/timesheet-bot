import 'reflect-metadata'

import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { ListMarkingsService } from './ListMarkingsService'

let markingsRepository: IMarkingsRepository
let listMarkingsService: ListMarkingsService

describe('ListMarkingsService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    listMarkingsService = new ListMarkingsService(
      markingsRepository,
    )
  })

  it('should be able to list markings', async () => {
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

    const markingsList = await listMarkingsService.execute({})

    expect(markingsList).toHaveLength(1)
    expect(markingsList[0].id).toEqual(createdMarking.id)
  })

  it('should be able to list markings with pagination filters', async () => {
    await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    const secondMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    await markingsRepository.create({
      description: 'Description Example - 3',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    const projectsList = await listMarkingsService.execute({
      page: 1,
      perPage: 1,
    })

    expect(projectsList).toHaveLength(1)
    expect(projectsList[0].id).toEqual(secondMarking.id)
  })

  it('should be able to list markings with search filter', async () => {
    await markingsRepository.create({
      description: 'First Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    const secondMarking = await markingsRepository.create({
      description: 'Second Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    const thirdMarking = await markingsRepository.create({
      description: 'Third Marking',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      is_billable: true,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    const projectsList = await listMarkingsService.execute({
      search: 'd marking'
    })

    expect(projectsList).toHaveLength(2)
    expect(projectsList[0].id).toEqual(secondMarking.id)
    expect(projectsList[1].id).toEqual(thirdMarking.id)
  })
})
