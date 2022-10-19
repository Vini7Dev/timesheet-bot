export interface IDeleteMarkingsDTO {
  markings: IDeleteTimesheetMarkingDTO[]
}

interface IDeleteTimesheetMarkingDTO {
  id: string
  date: string
  start_time: string
  finish_time: string
}
