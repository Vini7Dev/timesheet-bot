export interface IEncrypt {
  encrypt(toEncrypt: string): string
  decrypt(toDecrypt: string): string
}
