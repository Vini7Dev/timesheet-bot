import { RedisPubSub } from 'graphql-redis-subscriptions'

import { redisConfig } from '@configs/redis'

export const pubsub = new RedisPubSub({ connection: redisConfig })
