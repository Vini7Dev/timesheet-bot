import { container } from 'tsyringe'

import { CryptoProvider } from './Encrypt/implementations/CryptoProvider'
import { IEncrypt } from './Encrypt/models/IEncrypt'
import { SeleniumProvider } from './Crawler/implementations/SeleniumProvider'
import { ICrawler } from './Crawler/models/ICrawler'

container.registerInstance<IEncrypt>('EncryptProvider', new CryptoProvider())
container.registerInstance<ICrawler>('CrawlerProvider', new SeleniumProvider())
