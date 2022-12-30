import { ICreateMarkingDTO } from '../dtos/ICreateMarkingDTO'
import { IListMarkingsDTO } from '../dtos/IListMarkingsDTO'
import { IListMarkingsByUserIdDTO } from '../dtos/IListMarkingsByUserIdDTO'
import { IListByIdsMarkingsByUserIdDTO } from '../dtos/IListByIdsMarkingsByUserIdDTO'
import { IUpdateMarkingDTO } from '../dtos/IUpdateMarkingDTO'
import {
  IUpdateManyTimesheetStatusDTO,
  IUpdateManyTimesheetStatusResponse
} from '../dtos/IUpdateManyTimesheetStatusDTO'
import { Marking } from '../infra/prisma/entities/Marking'

export interface IMarkingsRepository {
  findById(id: string): Promise<Marking | null>
  list(filters: IListMarkingsDTO): Promise<Marking[]>
  listByIds(data: IListByIdsMarkingsByUserIdDTO): Promise<Marking[]>
  listByUserId(filters: IListMarkingsByUserIdDTO): Promise<Marking[]>
  create(data: ICreateMarkingDTO): Promise<Marking>
  update(data: IUpdateMarkingDTO): Promise<Marking>
  updateManyTimesheetStatus(data: IUpdateManyTimesheetStatusDTO): Promise<IUpdateManyTimesheetStatusResponse>
  delete(id: string): Promise<string>
}
