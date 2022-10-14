import { IUpdateCustomerDTO } from '@modules/customers/dtos/IUpdateCustomerDTO'
import { ICreateMarkingDTO } from '../dtos/ICreateMarkingDTO'
import { Marking } from '../infra/prisma/entities/Marking'

export interface IMarkingsRepository {
  findById(id: string): Promise<Marking | null>
  list(filters: { page?: number, perPage?: number, date?: string }): Promise<Marking[]>
  create(data: ICreateMarkingDTO): Promise<Marking>
  update(data: IUpdateCustomerDTO): Promise<Marking>
  delete(id: string): Promise<String>
}
