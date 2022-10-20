import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { ICrawlerResponseDTO } from '../dtos/ICrawlerResponseDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { ITimesheetAuthDTO } from '../dtos/ITimesheetAuthDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'

export interface ICrawler {
  stopCrawler(): Promise<void>
  authenticateTimesheet(data: ITimesheetAuthDTO): Promise<void>
  saveTimesheetTasks(data: ISaveMarkingsDTO): Promise<ICrawlerResponseDTO>
  updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO>
  deleteTimesheetTasks(data: IDeleteMarkingsDTO): Promise<ICrawlerResponseDTO>
}
