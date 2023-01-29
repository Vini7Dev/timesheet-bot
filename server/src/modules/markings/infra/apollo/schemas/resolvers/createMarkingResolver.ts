import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { CreateMarkingService } from '@modules/markings/services/CreateMarkingService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface ICreateMarkingInput {
  data: {
    description: string
    date: string
    start_time: string
    finish_time: string
    start_interval_time?: string
    finish_interval_time?: string
    is_billable: boolean
    project_id: string
  }
}

export const createMarking = async (
  _: any,
  { data: {
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    is_billable,
    project_id,
  } }: ICreateMarkingInput,
  ctx: IAppContext,
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const createMarkingService = container.resolve(CreateMarkingService)

  const createdMarking = await createMarkingService.execute({
    authenticatedUserId,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    is_billable,
    project_id,
  })

  return createdMarking
}
