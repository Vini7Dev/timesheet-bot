import { getOrdenationValue } from './orderMarkingsByTime'

interface IGroupProjectsByCustomerResult {
  customer: Omit<ICustomerProps, 'code'>
  projects: IProjectProps[]
}

export const groupProjectsByCustomer = (
  projects: IProjectProps[]
): IGroupProjectsByCustomerResult[] => {
  const groups: IGroupProjectsByCustomerResult[] = []

  for (const project of projects) {
    const indexOfGroup = groups.findIndex(
      group => group.customer.name === project.customer.name
    )

    if (indexOfGroup === -1) {
      groups.push({
        customer: project.customer,
        projects: [project]
      })
    } else {
      groups[indexOfGroup].projects.push(project)
    }
  }

  const orderGroups = groups.sort((groupA, groupB) => {
    return getOrdenationValue({
      compareA: groupA.customer.name,
      compareB: groupB.customer.name
    })
  })

  return orderGroups
}
