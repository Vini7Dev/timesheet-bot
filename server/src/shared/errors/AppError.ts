import { GraphQLError } from 'graphql'

export class AppError extends GraphQLError {
  readonly status: number

  constructor(message: string, status = 400) {
    super(message, {
      extensions: {
        code: status
      }
    })

    this.status = status
  }
}
