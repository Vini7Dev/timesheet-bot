import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { buildRepositoryFiltersObject } from '@utils/buildRepositoryFiltersObject'
import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO'
import { IListMarkingsByUserIdDTO } from '@modules/markings/dtos/IListMarkingsByUserIdDTO'
import { IUpdateMarkingDTO } from '@modules/markings/dtos/IUpdateMarkingDTO'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
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
      orderBy: { date: 'desc' }
    })

    return filteredMarkings as Marking[]
  }

  public async listByIds(ids: string[]): Promise<Marking[]> {
    const filteredMarkings = await this.client.markings.findMany({
      where: { id: { in: ids }, deleted_at: null }
    })

    return filteredMarkings
  }

  public async listByUserId({
    user_id,
    page,
    perPage,
    date
  }: IListMarkingsByUserIdDTO): Promise<Marking[]> {
    const filteredMarkings = await this.client.markings.findMany({
      skip: page,
      take: perPage,
      where: {
        AND: {
          ...buildRepositoryFiltersObject({
            date,
            user_id,
          }),
          deleted_at: null
        }
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
  }: ICreateMarkingDTO): Promise<Marking> {
    const createdMarking = await this.client.markings.create({
      data: {
        on_timesheet_status: 'NOT_SENT',
        description,
        date,
        start_time,
        finish_time,
        start_interval_time,
        finish_interval_time,
        work_class,
        project_id,
        user_id,
      },
      include: { project: true, user: true }
    })

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
    const updatedMarking = await this.client.markings.update({
      where: { id },
      data: {
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
        updated_at: new Date(),
      },
      include: { project: true, user: true }
    })

    return updatedMarking
  }

  public async delete(id: string): Promise<string> {
    await this.client.markings.update({
      data: { deleted_at: new Date() },
      where: { id }
    })

    return id
  }
}
