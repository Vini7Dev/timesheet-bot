export const formatPad = (value: number): string => {
  return value.toString().padStart(2, '0')
}

export const formatDatePad = (date: string, sep = '-'): string => {
  const [year, month, day] = date.split(sep)

  const yearFormated = year.toString().padEnd(4, '0')
  const monthFormated = month.toString().padStart(2, '0')
  const dayFormated = day.toString().padStart(2, '0')

  return [yearFormated, monthFormated, dayFormated].join(sep)
}
