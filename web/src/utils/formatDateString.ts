export const formatDateString = (date: string): string => {
  return date.split('-').reverse().join('/')
}
