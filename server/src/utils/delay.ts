export const delay = async (time: number) => {
  return new Promise(resolver => setTimeout(resolver, time))
}
