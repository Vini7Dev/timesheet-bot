import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { SendMarkingsToTimesheetService } from '@modules/markings/services/SendMarkingsToTimesheetService'

interface ISendMarkingsToTimesheetInput {
  data: {
    markingIds: string[]
  }
}

export const sendMarkingsToTimesheet = async (
  _: any,
  { data }: ISendMarkingsToTimesheetInput,
  ctx: IAppContext,
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const sendMarkingsToTimesheetService = container.resolve(SendMarkingsToTimesheetService)

  const sendMarkingsResult = await sendMarkingsToTimesheetService.execute({
    authenticatedUserId,
    markingIds: data.markingIds,
  })

  return sendMarkingsResult
}
