import { ICreateMarkingDTO } from '../dtos/ICreateMarkingDTO'
import { IUpdateMarkingDTO } from '../dtos/IUpdateMarkingDTO'
import { Marking } from '../infra/prisma/entities/Marking'

export interface IMarkingsRepository {
  findById(id: string): Promise<Marking | null>
  list(filters: { page?: number, perPage?: number, date?: string }): Promise<Marking[]>
  create(data: ICreateMarkingDTO): Promise<Marking>
  update(data: IUpdateMarkingDTO): Promise<Marking>
  delete(id: string): Promise<String>
}
