import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO';
import { IListMarkingsByUserIdDTO } from '@modules/markings/dtos/IListMarkingsByUserIdDTO';
import { IListMarkingsDTO } from '@modules/markings/dtos/IListMarkingsDTO';
import { IUpdateMarkingDTO } from '@modules/markings/dtos/IUpdateMarkingDTO';
import { Marking } from '@modules/markings/infra/prisma/entities/Marking';
import { AppError } from '@shared/errors/AppError';
import { IMarkingsRepository } from '../IMarkingsRepository'

export class FakeMarkingsRepository implements IMarkingsRepository {
  private markings: Marking[]

  constructor () {
    this.markings = []
  }

  public async findById(id: string): Promise<Marking | null> {
    const findedMarking = this.markings.find(marking => marking.id === id)

    return findedMarking ?? null
  }

  public async list({
    page = 0,
    perPage = 10,
    date,
  }: IListMarkingsDTO): Promise<Marking[]> {
    const filteredMarkings = this.markings
      .filter(marking => {
        return (date ? marking.date === date : true)
      })
      .slice(page, perPage + page)

    return filteredMarkings
  }

  public async listByUserId({
    user_id,
    page = 0,
    perPage = 10,
  }: IListMarkingsByUserIdDTO): Promise<Marking[]> {
    const filteredMarkings = this.markings
      .filter(marking => marking.user_id === user_id)
      .slice(page, perPage + page)

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
    const createDate = new Date()

    const createdMarking = {
      id: Math.random().toString(),
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
      created_at: createDate,
      updated_at: createDate,
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
    if (user_id) updatedMarking.user_id = user_id
    updatedMarking.updated_at = (new Date(Date.now() + 10000))

    this.markings[markingToUpdateIndex] = updatedMarking

    return updatedMarking
  }

  public async delete(id: string): Promise<string> {
    const markingToDeleteIndex = this.markings.findIndex(marking => marking.id === id)

    if(markingToDeleteIndex !== -1) {
      this.markings.splice(markingToDeleteIndex, 1)
    }

    return id
  }
}
