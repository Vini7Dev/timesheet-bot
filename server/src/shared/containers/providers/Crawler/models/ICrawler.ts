import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { IMarkingResponseDTO } from '../dtos/IMarkingResponseDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { ITimesheetAuthDTO } from '../dtos/ITimesheetAuthDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'

export interface ICrawler {
  stopCrawler(): Promise<void>
  authenticateTimesheet(data: ITimesheetAuthDTO): Promise<void>
  saveTimesheetTasks(data: ISaveMarkingsDTO): Promise<IMarkingResponseDTO[]>
  updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<IMarkingResponseDTO[]>
  deleteTimesheetTasks(data: IDeleteMarkingsDTO): Promise<IMarkingResponseDTO[]>
}
