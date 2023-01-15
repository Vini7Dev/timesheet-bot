import { AppError } from '@shared/errors/AppError';
import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO';
import { IDeleteMarkingOptionsDTO } from '@modules/markings/dtos/IDeleteMarkingOptionsDTO';
import { IListByIdsMarkingsByUserIdDTO } from '@modules/markings/dtos/IListByIdsMarkingsByUserIdDTO';
import { IListMarkingsByUserIdDTO } from '@modules/markings/dtos/IListMarkingsByUserIdDTO';
import { IListMarkingsDTO } from '@modules/markings/dtos/IListMarkingsDTO';
import { IUpdateMarkingDTO } from '@modules/markings/dtos/IUpdateMarkingDTO';
import {
  IMarkingTimesheetStatus,
  IUpdateManyTimesheetStatusDTO,
  IUpdateManyTimesheetStatusResponse
} from '@modules/markings/dtos/IUpdateManyTimesheetStatusDTO';
import { Marking } from '@modules/markings/infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../IMarkingsRepository'

interface ISearchValidationProps {
  value: string
  search: string
}

export class FakeMarkingsRepository implements IMarkingsRepository {
  private markings: Marking[]

  constructor () {
    this.markings = []
  }

  private searchValidation({ value, search }: ISearchValidationProps): boolean {
    return value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }

  public async findById(id: string): Promise<Marking | null> {
    const findedMarking = this.markings.find(marking => marking.id === id && !marking.deleted_at)

    return findedMarking ?? null
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
    date,
  }: IListMarkingsDTO): Promise<Marking[]> {
    const filteredMarkings = this.markings
      .filter(marking => date ? marking.date === date : true)
      .filter(marking => !marking.deleted_at)
      .slice(page, perPage + page)

    if (search) {
      return filteredMarkings.filter(
        marking => this.searchValidation({ value: marking.description, search })
      )
    }

    return filteredMarkings
  }

  public async listByIds({
    ids,
    ignore_deleted_at = false,
  }: IListByIdsMarkingsByUserIdDTO): Promise<Marking[]> {
    const filteredMarkings = this.markings
      .filter(
        marking => ids.includes(marking.id) && (ignore_deleted_at || !marking.deleted_at)
      )

    return filteredMarkings
  }

  public async listByUserId({
    user_id,
    on_timesheet_status,
    page = 0,
    perPage = 10,
    search,
    date,
  }: IListMarkingsByUserIdDTO): Promise<Marking[]> {
    const filteredMarkings = this.markings
      .filter(marking => date ? marking.date === date : true)
      .filter(marking => on_timesheet_status ? marking.on_timesheet_status === on_timesheet_status : true)
      .filter(marking => marking.user_id === user_id && !marking.deleted_at)
      .slice(page, perPage + page)

    if (search) {
      return filteredMarkings.filter(
        marking => this.searchValidation({ value: marking.description, search })
      )
    }

    return filteredMarkings
  }

  public async create({
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project_id,
    user_id,
    on_timesheet_id,
    on_timesheet_status,
    deleted_at,
  }: ICreateMarkingDTO): Promise<Marking> {
    const createDate = new Date()

    const createdMarking = {
      id: Math.random().toString(),
      on_timesheet_status: on_timesheet_status ?? 'NOT_SENT',
      description,
      date,
      start_time,
      finish_time,
      start_interval_time,
      finish_interval_time,
      work_class,
      project_id,
      user_id,
      on_timesheet_id,
      created_at: createDate,
      updated_at: createDate,
      deleted_at: deleted_at,
    } as Marking

    this.markings.push(createdMarking)

    return createdMarking
  }

  public async update({
    id,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project_id,
    user_id,
  }: IUpdateMarkingDTO): Promise<Marking> {
    const markingToUpdateIndex = this.markings.findIndex(marking => marking.id === id)

    if(markingToUpdateIndex === -1) {
      throw new AppError('Marking not found!', 404)
    }

    const updatedMarking = this.markings[markingToUpdateIndex]
    if (description) updatedMarking.description = description
    if (date) updatedMarking.date = date
    if (start_time) updatedMarking.start_time = start_time
    if (finish_time) updatedMarking.finish_time = finish_time
    if (start_interval_time) updatedMarking.start_interval_time = start_interval_time
    if (finish_interval_time) updatedMarking.finish_interval_time = finish_interval_time
    if (work_class) updatedMarking.work_class = work_class
    if (project_id) updatedMarking.project_id = project_id
    if (user_id) updatedMarking.user_id = user_id
    updatedMarking.updated_at = (new Date(Date.now() + 10000))

    this.markings[markingToUpdateIndex] = updatedMarking

    return updatedMarking
  }

  public async updateManyTimesheetStatus(
    { markingsStatus }: IUpdateManyTimesheetStatusDTO
  ): Promise<IUpdateManyTimesheetStatusResponse> {
    const markingsStatusResponse: IMarkingTimesheetStatus[] = []

    for(const markingStatus of markingsStatus) {
      const markingToUpdateIndex = this.markings.findIndex(
        marking => marking.id === markingStatus.marking_id
      )

      if (markingToUpdateIndex === -1) {
        continue
      }

      const markingToUpdate = this.markings[markingToUpdateIndex]

      if (markingStatus.timesheet_error) markingToUpdate.timesheet_error = markingStatus.timesheet_error.toString()
      markingToUpdate.on_timesheet_id = markingStatus.on_timesheet_id
      markingToUpdate.on_timesheet_status = markingStatus.on_timesheet_status

      this.markings[markingToUpdateIndex] = markingToUpdate

      markingsStatusResponse.push({
        marking_id: markingToUpdate.id,
        on_timesheet_id: markingToUpdate.on_timesheet_id,
        on_timesheet_status: markingToUpdate.on_timesheet_status,
        timesheet_error: markingToUpdate.timesheet_error,
      })
    }

    return { markingsStatus: markingsStatusResponse }
  }

  public async delete(id: string, options?: IDeleteMarkingOptionsDTO): Promise<string> {
    const markingToDeleteIndex = this.markings.findIndex(marking => marking.id === id)

    if(markingToDeleteIndex !== -1) {
      this.markings[markingToDeleteIndex].on_timesheet_status = 'NOT_SENT'
      this.markings[markingToDeleteIndex].timesheet_error = undefined
      this.markings[markingToDeleteIndex].deleted_at = new Date()

      if (options?.clearTimesheetId) {
        this.markings[markingToDeleteIndex].on_timesheet_id = undefined
      }
    }

    return id
  }
}
