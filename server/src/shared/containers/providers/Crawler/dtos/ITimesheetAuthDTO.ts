import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface ITimesheetAuthDTO {
  username: string
  password: string
  pubsub: RedisPubSub
}
