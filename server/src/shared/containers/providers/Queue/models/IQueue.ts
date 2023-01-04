import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface IAddQueueProps {
  name: string
  data: object | object[]
}

export interface IProcessProps {
  pubsub: RedisPubSub
  providers: object
}

export interface IQueue {
  add(data: IAddQueueProps): Promise<void>
  process(props: IProcessProps): void
}
