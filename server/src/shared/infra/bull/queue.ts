import 'dotenv/config'
import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/containers'

import { ProcessQueueControl } from './ProcessQueueControl'

const processQueueControl = container.resolve(ProcessQueueControl)

processQueueControl.execute()

console.log('===> Processing queues!')
