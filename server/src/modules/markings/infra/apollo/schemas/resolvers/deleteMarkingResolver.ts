import { IAppContext } from '@shared/infra/apollo/context'
import { container } from 'tsyringe'

import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { DeleteMarkingService } from '@modules/markings/services/DeleteMarkingService'

interface IDeleteMarkingInput {
  id: string
}

export const deleteMarking = async (
  _: any,
  { id }: IDeleteMarkingInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const deleteMarkingService = container.resolve(DeleteMarkingService)

  const deletedMarkingId = await deleteMarkingService.execute({
    markingId: id,
  })

  return deletedMarkingId
}
