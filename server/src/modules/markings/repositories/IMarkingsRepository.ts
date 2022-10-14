import { ICreateMarkingDTO } from '../dtos/ICreateMarkingDTO'
import { Marking } from '../infra/prisma/entities/Marking'

export interface IMarkingsRepository {
  create(data: ICreateMarkingDTO): Promise<Marking>
}
