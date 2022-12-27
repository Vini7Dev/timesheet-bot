import { OnTimesheetStatus } from '@prisma/client'

import { AppError } from '@shared/errors/AppError'

interface IMarkingStatusUpdated {
  marking_id: string
  on_timesheet_id?: string
  on_timesheet_status: OnTimesheetStatus
  timesheet_error?: string[]
}

interface IMarkingStatusUpdatedResponse extends IMarkingStatusUpdated {
  error?: AppError
}

interface IServiceProps {
  authenticatedUserId: string
  markingStatusUpdated: IMarkingStatusUpdated[]
}

interface IServiceResponse {
  markingStatusUpdated: IMarkingStatusUpdatedResponse[]
}

export class UpdateManyMarkingsTimesheetStatus {
  public async execute(data: IServiceProps): Promise<IServiceResponse> {
    throw new Error('Method not implemented!')
  }
}
