import dayjs from 'dayjs'

export const formattedDate = (date: string) => {
  return dayjs(new Date(Number(date) * 1000))
}
