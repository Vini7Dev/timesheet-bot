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
  const authenticatedUserId = ensureAuthenticated(ctx)

  const deleteMarkingService = container.resolve(DeleteMarkingService)

  const deletedMarkingId = await deleteMarkingService.execute({
    authenticatedUserId: authenticatedUserId,
    marking_id: id,
  })

  return deletedMarkingId
}
