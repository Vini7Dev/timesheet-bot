import { ICreateMarkingDTO } from '../dtos/ICreateMarkingDTO'
import { IListMarkingsByUserIdDTO } from '../dtos/IListMarkingsByUserIdDTO'
import { IListMarkingsDTO } from '../dtos/IListMarkingsDTO'
import { IUpdateMarkingDTO } from '../dtos/IUpdateMarkingDTO'
import { Marking } from '../infra/prisma/entities/Marking'

export interface IMarkingsRepository {
  findById(id: string): Promise<Marking | null>
  list(filters: IListMarkingsDTO): Promise<Marking[]>
  listByIds(ids: string[]): Promise<Marking[]>
  listByUserId(filters: IListMarkingsByUserIdDTO): Promise<Marking[]>
  create(data: ICreateMarkingDTO): Promise<Marking>
  update(data: IUpdateMarkingDTO): Promise<Marking>
  delete(id: string): Promise<string>
}
