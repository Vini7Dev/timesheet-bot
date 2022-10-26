export interface IDeleteMarkingsDTO {
  markings: IDeleteTimesheetMarkingDTO[]
}

interface IDeleteTimesheetMarkingDTO {
  id: string
  on_timesheet_id: string
}
