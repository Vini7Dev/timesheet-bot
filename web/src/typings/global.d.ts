type OnTimesheetStatus = 'SENT' | 'SENDING' | 'NOT_SENT' | 'ERROR'

interface IMarkingData {
  id: string
  on_timesheet_id?: string
  on_timesheet_status: OnTimesheetStatus
  timesheet_error?: string
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time: string
  finish_interval_time: string
  is_billable: boolean
  user_id: string
  project_id: string
  deleted_at?: string
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
