import { withFilter  } from 'graphql-subscriptions'
import { OnTimesheetStatus } from '@prisma/client'

import { TRIGGER_MARKINGS_TO_TIMESHEET } from '@utils/constants'
import { IAppContext, IWSAppContext } from '@shared/infra/apollo/context'

interface IMarkingsStatusUpdated {
  id: string,
  on_timesheet_status: OnTimesheetStatus,
  timesheet_error?: string
}

interface IPayload {
  userOwnerId: string
  markings: IMarkingsStatusUpdated[]
}

export const onSendMarkingsToTimesheet = {
  subscribe: withFilter(
    (_: any, __: any, { pubsub }: IWSAppContext) => {
      return pubsub.asyncIterator(TRIGGER_MARKINGS_TO_TIMESHEET)
    },
    (payload: IPayload, _: any, context: IAppContext) => {
      return context.authentication.user_id === payload.userOwnerId
    }
  ),
}
