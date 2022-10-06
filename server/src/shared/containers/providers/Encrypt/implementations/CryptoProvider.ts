import crypto, { Encoding } from 'crypto'

import { IEncrypt } from '../models/IEncrypt'

export class CryptoProvider implements IEncrypt {
  private algorithm = 'aes-256-ctr'

  private secret = 'DEFAULT'

  private inputEncoding: Encoding = 'utf-8'

  private outputEncoding: Encoding = 'hex'

  private cipher = crypto.createCipheriv(this.algorithm, this.secret, '')

  private decipher = crypto.createDecipheriv(this.algorithm, this.secret, '')

  encrypt(toEncrypt: string): string {
    return this.cipher.update(toEncrypt, this.inputEncoding, this.outputEncoding)
  }

  decrypt(toDecrypt: string): string {
    return this.decipher.update(toDecrypt, this.outputEncoding, this.inputEncoding)
  }
}
