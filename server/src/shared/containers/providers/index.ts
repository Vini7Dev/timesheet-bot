import { container } from 'tsyringe'

import { CryptoProvider } from './Encrypt/implementations/CryptoProvider'
import { IEncrypt } from './Encrypt/models/IEncrypt'

container.registerSingleton<IEncrypt>('EncryptProvider', CryptoProvider)
