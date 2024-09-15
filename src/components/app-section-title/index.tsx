import React from 'react'

type Props = {
  title: string,
  description: string
}
const SectionTitle = ({
  title,
  description
}) => {
  return (
    <div>
      <h2 className="font-medium text-2xl">{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default SectionTitle