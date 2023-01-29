import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { UpdateMarkingService } from '@modules/markings/services/UpdateMarkingService'

interface IUpdateMarkingInput {
  data: {
    marking_id: string
    project_id?: string
    description?: string
    date?: string
    start_time?: string
    finish_time?: string
    start_interval_time?: string
    finish_interval_time?: string
    is_billable?: boolean
  }
}

export const updateMarking = async (
  _: any,
  { data: {
    marking_id,
    project_id,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    is_billable,
  } }: IUpdateMarkingInput,
  ctx: IAppContext,
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const updateMarkingService = container.resolve(UpdateMarkingService)

  const updatedMarking = await updateMarkingService.execute({
    authenticatedUserId,
    marking_id,
    project_id,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    is_billable,
  })

  return updatedMarking
}
