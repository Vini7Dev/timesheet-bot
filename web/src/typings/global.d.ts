type OnTimesheetStatus = 'SENT' | 'NOT_SENT' | 'ERROR'

type WorkClass = 'PRODUCTION' | 'ABSENCE'

interface IMarkingData {
  id: string
  on_timesheet_status: OnTimesheetStatus
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time: string
  finish_interval_time: string
  work_class: WorkClass
  user_id: string
  project_id: string
  project: {
    id: string
    name: string
  }
}

interface IProjectProps {
  id: string
  code: string
  name: string
  customer: {
    id: string
    name: string
  }
}

interface ICustomerProps {
  id: string
  code: string
  name: string
}
