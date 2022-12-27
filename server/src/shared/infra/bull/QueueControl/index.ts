import 'reflect-metadata'

import '@shared/containers'

import BullQueue from 'bull'
import { container } from 'tsyringe'

import { redisConfig } from '@configs/redis'
import { AppError } from '@shared/errors/AppError'

import * as Jobs from '../../../../jobs'

interface IQueue {
  bull: BullQueue.Queue
  name: string
  handle: (props: any) => Promise<void>
}

interface IQueueControlAdd {
  name: string
  data: any
}

export class QueueControl {
  private static queues: IQueue[] = Object.values(Jobs).map(job => ({
    bull: new BullQueue(job.key, { redis: redisConfig }),
    name: job.key,
    handle: job.handle,
  }))

  public static getQueues(): IQueue[] {
    return this.queues
  }

  public static async add({ name, data }: IQueueControlAdd): Promise<BullQueue.Job> {
    const queueToAdd = this.queues.find(queue => queue.name === name)

    if(!queueToAdd) {
      throw new AppError('Queue not found!', 404)
    }

    return queueToAdd.bull.add(data)
  }

  public static async process(): Promise<void> {
    this.queues.forEach(queue => {
      queue.bull.process(queue.handle)

      queue.bull.on('failed', (job, err) => {
        console.log(`===> Job Failed!`)
        console.log(`===> Job Name: ${queue.name} | Job Data: ${
          JSON.stringify(job.data, null, 2)
        }`)
        console.error(err)
      })
    })
  }
}
