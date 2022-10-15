import { container } from 'tsyringe'

import { ShowMarkingService } from '@modules/markings/services/ShowMarkingService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IMarkingInput {
  id: string
}

export const marking = async (
  _: any,
  { id }: IMarkingInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const showMarkingService = container.resolve(ShowMarkingService)

  const markingFinded = await showMarkingService.execute({
    markingId: id,
  })

  return markingFinded
}
