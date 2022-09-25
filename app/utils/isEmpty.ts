export const isEmpty = (value: any) => {
  if (value === undefined) {
    return true
  }

  if (value === '0') {
    return true
  }

  if (value === null) {
    return true
  }

  return false
}
