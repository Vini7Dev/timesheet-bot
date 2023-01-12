interface IFormatDateStringProps {
  date: string
  fromSeparator: string
  toSeparator: string
}

export const formatDateString = ({
  date,
  fromSeparator,
  toSeparator,
}: IFormatDateStringProps) => {
  return date.split(fromSeparator).reverse().join(toSeparator)
}
