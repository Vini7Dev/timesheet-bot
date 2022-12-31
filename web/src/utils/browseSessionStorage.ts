type KeyOrigin = 'timer'

interface IGetItemProps {
  keyOrigin: KeyOrigin
  key: string
}

interface ISetItemProps<T> {
  keyOrigin: KeyOrigin
  key: string
  payload: T
}

interface IRemoveItemProps {
  keyOrigin: KeyOrigin
  key: string
}

const SESSION_STORAGE_PREFIX_KEY = '@Multify'

const getItem = ({
  keyOrigin,
  key
}: IGetItemProps): string | null => {
  const completeKey = `${SESSION_STORAGE_PREFIX_KEY}:${keyOrigin}:${key}`

  return sessionStorage.getItem(completeKey)
}

const setItem = <T>({
  keyOrigin,
  key,
  payload
}: ISetItemProps<T>): void => {
  const completeKey = `${SESSION_STORAGE_PREFIX_KEY}:${keyOrigin}:${key}`

  sessionStorage.setItem(
    completeKey,
    typeof payload === 'string' ? payload : JSON.stringify(payload)
  )
}

const removeItem = ({
  keyOrigin,
  key
}: IRemoveItemProps): void => {
  const completeKey = `${SESSION_STORAGE_PREFIX_KEY}:${keyOrigin}:${key}`

  sessionStorage.removeItem(completeKey)
}

export const browseSessionStorage = {
  getItem,
  setItem,
  removeItem
}
