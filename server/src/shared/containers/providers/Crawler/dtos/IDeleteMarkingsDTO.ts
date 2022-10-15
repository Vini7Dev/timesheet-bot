import { ITimesheetAuthDTO } from './ITimesheetAuthDTO'

export interface IDeleteMarkingsDTO extends ITimesheetAuthDTO {
  markings: IDeleteTimesheetMarkingDTO[]
}

interface IDeleteTimesheetMarkingDTO {
  id: string
  date: string
  start_time: string
  finish_time: string
}
