import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO'
import { IUpdateMarkingDTO } from '@modules/markings/dtos/IUpdateMarkingDTO'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { buildRepositoryFiltersObject } from '@utils/buildRepositoryFiltersObject'
import { Marking } from '../entities/Marking'

export class MarkingsRepository extends AppRepository implements IMarkingsRepository {
  public async findById(id: string): Promise<Marking | null> {
    const findedMarking = await this.client.markings.findFirst({
      where: { id },
      include: { project: true, user: true }
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
        AND: buildRepositoryFiltersObject({
          date,
        })
      }
    })

    return filteredMarkings as Marking[]
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
      },
      include: { project: true, user: true }
    })

    return updatedMarking
  }

  public async delete(id: string): Promise<string> {
    await this.client.markings.delete({
      where: { id },
    })

    return id
  }
}
