export const buildRepositoryFiltersObject = <T extends object>(
  filters: T
): Partial<T> => {
  const auxFilters = filters as any
  const buildedFilters = {}

  Object.keys(filters).forEach((key) => {
    if (auxFilters[key]) {
      Object.assign(buildedFilters, { [key]: auxFilters[key] })
    }
  })

  return buildedFilters
}
