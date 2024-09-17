import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

const diffForHumans = (t) => {
  return dayjs(t).fromNow()
}
const humanFriendlyDate = (t) => {
  return dayjs(t).format('LLLL')
}

type Props = {
  timestamp: number
}

const AppDate = ({
  timestamp
}: Props) => {
  return (
    <span title={humanFriendlyDate(timestamp)}>
      {diffForHumans(timestamp)}
    </span>
  )
}

export default AppDate