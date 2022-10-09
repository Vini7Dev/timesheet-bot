import { IEncrypt } from '../models/IEncrypt'

export class FakeEncryptProvider implements IEncrypt {
  public encrypt(toEncrypt: string): string {
    return toEncrypt;
  }

  public decrypt(toDecrypt: string): string {
    return toDecrypt;
  }
}
