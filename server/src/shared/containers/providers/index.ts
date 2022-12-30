import { container } from 'tsyringe'

import { redisConfig } from '@configs/redis'
import { CryptoProvider } from './Encrypt/implementations/CryptoProvider'
import { IEncrypt } from './Encrypt/models/IEncrypt'
import { SeleniumProvider } from './Crawler/implementations/SeleniumProvider'
import { ICrawler } from './Crawler/models/ICrawler'
import { IQueue } from './Queue/models/IQueue'
import { BullProvider } from './Queue/implementations/BullProvider'

container.registerInstance<IEncrypt>('EncryptProvider', new CryptoProvider())
container.registerInstance<ICrawler>('CrawlerProvider', new SeleniumProvider())
container.register<IQueue>('QueueProvider', BullProvider)
