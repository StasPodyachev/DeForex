import { DEAL_INFO } from 'constrants'

export const mapDeal = (dataOriginal: any) => {
  const data = dataOriginal?.reduce((result: any, value: string, index: number) => {
    const key = DEAL_INFO[index]

    result[key] = value

    return result
  }, {})

  return data
}
