import { RedisPubSub } from 'graphql-redis-subscriptions'

import { redisConfig } from '@configs/redis'
import { IPubSub } from '../models/IPubSub'

export class ApolloRedisPubSub implements IPubSub {
  private pubSub: RedisPubSub

  constructor() {
    this.pubSub = new RedisPubSub({ connection: redisConfig })
  }

  public async publish<Payload extends object>(key: string, payload: Payload): Promise<void> {
    this.pubSub.publish(key, payload)
  }

  public asyncIterator(key: string): AsyncIterator<any, any, undefined> {
    return this.pubSub.asyncIterator(key)
  }
}
