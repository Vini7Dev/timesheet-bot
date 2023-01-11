import { OnTimesheetStatus } from '@prisma/client'

import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { buildRepositoryFiltersObject } from '@utils/buildRepositoryFiltersObject'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO'
import { IUpdateMarkingDTO } from '@modules/markings/dtos/IUpdateMarkingDTO'
import { IDeleteMarkingOptionsDTO } from '@modules/markings/dtos/IDeleteMarkingOptionsDTO'
import { IListMarkingsByUserIdDTO } from '@modules/markings/dtos/IListMarkingsByUserIdDTO'
import { IListByIdsMarkingsByUserIdDTO } from '@modules/markings/dtos/IListByIdsMarkingsByUserIdDTO'
import {
  IUpdateManyTimesheetStatusDTO,
  IUpdateManyTimesheetStatusResponse
} from '@modules/markings/dtos/IUpdateManyTimesheetStatusDTO'
import { Marking } from '../entities/Marking'

export class MarkingsRepository extends AppRepository implements IMarkingsRepository {
  public async findById(id: string): Promise<Marking | null> {
    const findedMarking = await this.client.markings.findFirst({
      where: { id, deleted_at: null },
      include: { project: { include: { customer: true } }, user: true },
    })

    return findedMarking
  }

  public async list({
    page,
    perPage,
    date,
  }: { page?: number, perPage?: number, date?: string }): Promise<Marking[]> {
    const filteredMarkings = await this.client.markings.findMany({
      skip: page,
      take: perPage,
      where: {
        AND: {
          ...buildRepositoryFiltersObject({
            date,
          }),
          deleted_at: null
        }
      },
      orderBy: { date: 'desc' },
    })

    return filteredMarkings as Marking[]
  }

  public async listByIds({
    ids,
    ignore_deleted_at = false,
  }: IListByIdsMarkingsByUserIdDTO): Promise<Marking[]> {
    const whereFilters = ignore_deleted_at
      ? { id: { in: ids } }
      : { id: { in: ids }, deleted_at: null }

    const filteredMarkings = await this.client.markings.findMany({
      where: whereFilters,
      include: { project: { include: { customer: true } }, user: true },
    })

    return filteredMarkings
  }

  public async listByUserId({
    user_id,
    on_timesheet_status,
    page,
    perPage,
    date
  }: IListMarkingsByUserIdDTO): Promise<Marking[]> {
    const filteredMarkings = await this.client.markings.findMany({
      skip: page,
      take: perPage,
      where: {
        ...buildRepositoryFiltersObject({
          date,
          user_id,
          on_timesheet_status,
        }),
        AND: {
          OR: [
            { deleted_at: null },
            { deleted_at: { not: null }, on_timesheet_id: { not: null } },
          ],
        },
      },
      orderBy: { date: 'desc' },
      include: { project: true }
    })

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
  }: ICreateMarkingDTO): Promise<Marking> {
    const createdMarking = await this.client.markings.create({
      data: {
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
      },
      include: { project: true, user: true }
    })

    return createdMarking
  }

  public async update({
    id,
    on_timesheet_id,
    on_timesheet_status,
    timesheet_error,
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
    const updatedMarking = await this.client.markings.update({
      where: { id },
      data: {
        id,
        on_timesheet_id,
        on_timesheet_status,
        timesheet_error,
        description,
        date,
        start_time,
        finish_time,
        start_interval_time,
        finish_interval_time,
        work_class,
        project_id,
        user_id,
        updated_at: new Date(),
      },
      include: { project: true, user: true }
    })

    return updatedMarking
  }

  public async updateManyTimesheetStatus(
    { markingsStatus }: IUpdateManyTimesheetStatusDTO
  ): Promise<IUpdateManyTimesheetStatusResponse> {
    for (const markingStatus of markingsStatus) {
      await this.client.markings.update({
        data: {
          on_timesheet_id: markingStatus.on_timesheet_id ?? null,
          on_timesheet_status: markingStatus.on_timesheet_status,
          timesheet_error: markingStatus.timesheet_error,
        },
        where: { id: markingStatus.marking_id }
      })
    }

    return { markingsStatus }
  }

  public async delete(id: string, options?: IDeleteMarkingOptionsDTO): Promise<string> {
    const dataToReset = {
      on_timesheet_status: OnTimesheetStatus.NOT_SENT,
      timesheet_error: undefined,
      deleted_at: new Date(),
    }

    if (options?.clearTimesheetId) {
      Object.assign(dataToReset, {
        on_timesheet_id: undefined
      })
    }

    await this.client.markings.update({
      data: dataToReset,
      where: { id }
    })

    return id
  }
}
