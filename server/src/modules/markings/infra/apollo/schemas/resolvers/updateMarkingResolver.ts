import { WorkClass } from '@prisma/client'
import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { UpdateMarkingService } from '@modules/markings/services/UpdateMarkingService'

interface IUpdateMarkingInput {
  data: {
    markingId: string
    description?: string
    date?: string
    start_time?: string
    finish_time?: string
    start_interval_time?: string
    finish_interval_time?: string
    work_class?: WorkClass
    project_id?: string
  }
}

export const updateMarking = async (
  _: any,
  { data: {
    markingId,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project_id,
  } }: IUpdateMarkingInput,
  ctx: IAppContext,
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const updateMarkingService = container.resolve(UpdateMarkingService)

  const updatedMarking = await updateMarkingService.execute({
    authenticatedUserId,
    markingId,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project_id,
  })

  return updatedMarking
}
