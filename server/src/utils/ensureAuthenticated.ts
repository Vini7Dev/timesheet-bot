import { AppError } from '@shared/errors/AppError'
import { IAppContext } from '@shared/infra/apollo/context'

export const ensureAuthenticated = (ctx: IAppContext): string => {
  const { user_id: authenticatedUserId } = ctx.authentication

  if(!authenticatedUserId) {
    throw new AppError('You must be authenticated!', 401)
  }

  return authenticatedUserId
}