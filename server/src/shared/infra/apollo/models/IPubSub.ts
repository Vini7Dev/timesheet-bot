export interface IPubSub {
  publish<Payload extends object>(key: string, payload: Payload): Promise<void>
  asyncIterator(key: string): AsyncIterator<any, any, undefined>
}
