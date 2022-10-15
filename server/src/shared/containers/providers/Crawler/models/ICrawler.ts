import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { IMarkingResponseDTO } from '../dtos/IMarkingResponseDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'

export interface ICrawler {
  saveTimesheetTasks(data: ISaveMarkingsDTO): Promise<IMarkingResponseDTO[]>
  updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<IMarkingResponseDTO[]>
  deleteTimesheetTasks(data: IDeleteMarkingsDTO): Promise<IMarkingResponseDTO[]>
}
