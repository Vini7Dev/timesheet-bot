import crypto, { Encoding } from 'crypto'

import { IEncrypt } from '../models/IEncrypt'

export class CryptoProvider implements IEncrypt {
  private algorithm = process.env.ENCRYPT_ALGORITHM ?? 'aes-256-ctr'

  private secret = process.env.ENCRYPT_KEY ?? 'DEFAULT'

  private iv = process.env.ENCRYPT_IV ?? 'DEFAULT'

  private inputEncoding: Encoding = 'utf-8'

  private outputEncoding: Encoding = 'hex'

  encrypt(toEncrypt: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.secret, this.iv)

    return cipher.update(toEncrypt, this.inputEncoding, this.outputEncoding)
  }

  decrypt(toDecrypt: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.secret, this.iv)

    return decipher.update(toDecrypt, this.outputEncoding, this.inputEncoding)
  }
}
